from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import HTTPException, Response, applications,Depends,status
from jose import JWTError, jwt
from passlib.context import CryptContext
import dbutils as dbop
from datetime import timedelta, datetime
from typing import Optional, List, Set, Union
# from api import db

# 令牌相关
SECRET_KEY = 'bb6c9b19591d08e33c655e8b0ed237c709738d2d03b21bb284e062acd916ee70'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 60    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#-------------------------------若干函数-------------------------------------







# @app.get("/users/me/", response_model=User)
# async def read_users_me(current_user: User = Depends(get_current_active_user)):
#     return current_user


# @app.get("/users/me/items/")
# async def read_own_items(current_user: User = Depends(get_current_active_user)):
#     return [{"item_id": "Foo", "owner": current_user.username}]