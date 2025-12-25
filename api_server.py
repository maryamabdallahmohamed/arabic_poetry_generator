from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer
from torch.nn.utils.rnn import pad_sequence
import math
import torch.nn as nn
import os
import uvicorn
from model_architecture import TP_PoetDecoder, PositionalEncoding, DecoderBlock, FeedForward
# Define the FastAPI app
app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the tokenizer and model
checkpoint_path = "notebooks/checkpoints/model_epoch_4.pt"
model = TP_PoetDecoder(vocab_size=32768)
checkpoint = torch.load(checkpoint_path, map_location="cpu")
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

tokenizer = AutoTokenizer.from_pretrained("konstantindobler/mistral7b-ar-tokenizer-swap-pure-bf16")

# Define the input schema
class GenerateRequest(BaseModel):
    text: str
    max_new_tokens: int = 10
    temperature: float = 0.5
    top_k: int = 10
    repetition_penalty: float = 1.9

# Define the generate function
def generate(model, input_ids, max_new_tokens=40, temperature=0.2, top_k=10, repetition_penalty=2.9):
    model.eval()
    with torch.no_grad():
        for _ in range(max_new_tokens):
            logits = model(input_ids)[:, -1, :]

            # repetition penalty
            for token in set(input_ids.flatten().tolist()):
                logits[:, token] /= repetition_penalty

            # temperature
            logits = logits / temperature

            topk_vals, topk_idx = torch.topk(logits, top_k)
            probs = torch.softmax(topk_vals, dim=-1)
            sampled_idx = torch.multinomial(probs, num_samples=1)
            next_token = torch.gather(topk_idx, 1, sampled_idx)
            input_ids = torch.cat([input_ids, next_token], dim=1)

        generated_text = tokenizer.decode(input_ids[0].tolist())
    return generated_text

# Define the API endpoint
@app.post("/generate")
def generate_poem(request: GenerateRequest):
    encoded_input = tokenizer.encode(request.text, return_tensors="pt")
    generated_text = generate(
        model,
        encoded_input,
        max_new_tokens=request.max_new_tokens,
        temperature=request.temperature,
        top_k=request.top_k,
        repetition_penalty=request.repetition_penalty
    )
    return {"generated_text": generated_text}

if __name__ == "__main__":

    uvicorn.run(app, host="0.0.0.0", port=8000)