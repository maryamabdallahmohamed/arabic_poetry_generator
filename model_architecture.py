from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer
from torch.nn.utils.rnn import pad_sequence
import math
import torch.nn as nn
import os
import uvicorn
# Define the model and tokenizer
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model)
        )

        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer("pe", pe.unsqueeze(0))

    def forward(self, x):
        return x + self.pe[:, :x.size(1)]

class FeedForward(nn.Module):
    def __init__(self, d_model, dim_ff, dropout):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(d_model, dim_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(dim_ff, d_model),
            nn.Dropout(dropout),
        )

    def forward(self, x):
        return self.layers(x)

class DecoderBlock(nn.Module):
    def __init__(self, d_model, nhead, dim_ff, dropout):
        super().__init__()

        self.ln1 = nn.LayerNorm(d_model)
        self.self_attn = nn.MultiheadAttention(
            embed_dim=d_model,
            num_heads=nhead,
            dropout=dropout,
            batch_first=True
        )

        self.ln2 = nn.LayerNorm(d_model)
        self.ff = FeedForward(d_model, dim_ff, dropout)

    def forward(self, x, attn_mask=None, key_padding_mask=None):
        # Self-Attention block
        h = self.ln1(x)
        attn_out, _ = self.self_attn(
            h, h, h,
            attn_mask=attn_mask,
            key_padding_mask=key_padding_mask
        )
        x = x + attn_out

        # Feed-Forward block
        h = self.ln2(x)
        x = x + self.ff(h)

        return x

class TP_PoetDecoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, nhead=8, num_layers=6, dim_ff=2048, dropout=0.1):
        super().__init__()
        self.token_embedding = nn.Embedding(vocab_size, d_model)
        self.positional_encoding = PositionalEncoding(d_model)
        self.layers = nn.ModuleList([DecoderBlock(d_model, nhead, dim_ff, dropout) for _ in range(num_layers)])
        self.final_norm = nn.LayerNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size)

    def forward(self, input_ids, attn_mask=None, padding_mask=None):
        x = self.token_embedding(input_ids) * math.sqrt(self.token_embedding.embedding_dim)
        x = self.positional_encoding(x)
        for layer in self.layers:
            x = layer(x, attn_mask=attn_mask, key_padding_mask=padding_mask)
        return self.lm_head(self.final_norm(x))