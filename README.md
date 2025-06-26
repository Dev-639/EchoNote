# MERN Blogging Platform 📝

A full-stack blogging web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js). This platform allows users to create, edit, and delete blog posts, as well as engage with content via comments. It features user authentication, a responsive UI, and protected routes.

---

## 🔧 Tech Stack

- **Frontend**: React, Redux, Flowbite React, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB Atlas  
- **Authentication**: JSON Web Tokens (JWT)  
- **State Management**: Redux Toolkit  
- **Deployment**: (add if deployed, e.g., Vercel for frontend, Render for backend)

---

## 🚀 Features

- User Sign Up, Login, and Logout  
- JWT-based authentication and route protection  
- Create, edit, and delete blog posts  
- Interactive comment section per post  
- Responsive UI with modern design  
- Role-based access (users can only edit/delete their own content)  
- Organized project structure for scalability  

---

## 📂 Project Structure

mern-blog/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── redux/
│ │ └── App.jsx
│ └── public/
├── api/ # Express backend
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── index.js
└── package.json

yaml
Copy
Edit

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-blog.git
cd mern-blog
2. Install dependencies
Backend:

bash
Copy
Edit
cd api
npm install
Frontend:

bash
Copy
Edit
cd client
npm install
3. Environment Variables
Create a .env file inside the api folder with your MongoDB URI and JWT secret:

ini
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
4. Run the application
In two terminals, run:

bash
Copy
Edit
# Terminal 1 - Backend
cd api
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

![Screenshot 2025-06-26 175826](https://github.com/user-attachments/assets/a422ff07-9ce2-44ab-925d-6acfcd0b9466)
![Screenshot 2025-06-26 175910](https://github.com/user-attachments/assets/e43ef8f2-dec6-4275-887b-716341d85a60)
![Screenshot 2025-06-26 180116](https://github.com/user-attachments/assets/4a1a7b11-43d7-40af-9182-7ee95930ea56)
![Screenshot 2025-06-26 180022](https://github.com/user-attachments/assets/27fe07ea-fda5-4575-a23a-967c0bfff23d)



🧩 Future Improvements

- Rich text editor for blog posts
- Like and bookmark system
- User profile pages
- Pagination and search functionality
- Admin dashboard for managing users and posts
