import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from supabase import create_client, Client

load_dotenv()

# 암호화 키 복호화
fernet_key = os.getenv("FERNET_KEY")
cipher = Fernet(fernet_key.encode())

encrypted_url = os.getenv("ENCRYPTED_SUPABASE_URL")
encrypted_key = os.getenv("ENCRYPTED_SUPABASE_KEY")

supabase_url = cipher.decrypt(encrypted_url.encode()).decode()
supabase_key = cipher.decrypt(encrypted_key.encode()).decode()

supabase: Client = create_client(supabase_url, supabase_key)
print("✅ Supabase 연결 성공")

def upload_data(data: dict):
    response = supabase.table('schedule').insert([data]).execute()
    print("✅ 데이터 저장 완료")

def fetch_data(day: int | str):
    response = supabase.table('schedule').select("*").eq("day", str(day)).execute()
    print(f"✅ day={day} 데이터 불러오기 완료")
    return response.data

def fetch_all_data():
    response = supabase.table('schedule').select("*").execute()
    return response.data if response else []

def delete_data(day):
    response = supabase.table('schedule').delete().eq('day', str(day)).execute()
    print(f"✅ day={day} 데이터 삭제 완료")
    # 성공 여부 판단 예시
    return response.status_code if hasattr(response, 'status_code') else None

def update_data(day: str, new_data: dict):
    response = supabase.table('schedule').update(new_data).eq('day', str(day)).execute()
    print(f"✅ day={day} 데이터 수정 완료")
    return response.status_code if hasattr(response, 'status_code') else None

