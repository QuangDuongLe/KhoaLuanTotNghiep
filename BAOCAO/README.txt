- CHUẨN BỊ MÔI TRƯỜNG CHẠY:
1. Tạo thư mục mới
2. Mở terminal, nhập lệnh git clone https://gitlab.com/kltl-ute/242k/13.git
3. Gõ cd server
3. Gõ npm install để cài đặt các thư viện cần thiết
4. Tạo file .env ở thư mục server với nội dung sau:
PORT=5000
mongodb_uri=""
mongodb_uri_test=""
CLOUDINARY_NAME = 
CLOUDINARY_KEY = 
CLOUDINARY_SECRET = 
ACCESS_TOKEN = access_token
REFRESH_TOKEN = refresh_token
EMAIL_APP_PASSWORD = 
EMAIL_NAME = 
VNP_TMN_CODE = 
VNP_HASH_SECRET=
VNP_URL=""
VNP_RETURN_URL=""
5. Gõ cd client
6. Gõ npm install để cài đặt các thư viện cần thiết

- CHẠY CHƯƠNG TRÌNH
1. Mở terminal -> cd server -> npm start
2. Mở terminal mới -> cd client -> npm start

