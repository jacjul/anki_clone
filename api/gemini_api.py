from dotenv import load_dotenv, find_dotenv
import os
from google import genai

load_dotenv(find_dotenv())
api_key = os.getenv("GEMINI_API_KEY")

def seperate_two_sentences(api_text, language="german", language2="english"):
    sentences = api_text.split(f"**{language} translation:**")[1]
    
    sentence_front = sentences.split(f"**{language2} translation:**")[0].strip()
    sentence_back = sentences.split(f"**{language2} translation:**")[1].strip()
    tuple_answer = (sentence_front,sentence_back)
    return (tuple_answer)


def get_sentence(word: str, language: str = "spanish", language2:str ="english") -> tuple | str:
    
    if not api_key:
        print("GEMINI_API_KEY not found in environment. Ensure .env is loaded.")
        return ""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=(
                f"Create an {language2} sentence which contains the following word translated {language2}: {word}. "
                f"Add the translation of the sentence in {language}." 
                f"Both sentences have to follow this structure: **{language} translation:** sentence  **{language2} translation:** sentence"
            ),
        )
        
        tuple_front_back = seperate_two_sentences(response.text, language= language , language2=language2)

        print(tuple_front_back)
        return tuple_front_back
    except Exception as e:
        print(f"Gemini API error: {e}")
        return ""