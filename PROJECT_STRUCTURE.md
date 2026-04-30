# Team Task Manager Structure

```text
Assignment1/
|-- backend/
|   |-- .env.example
|   `-- src/
|       |-- app.js
|       |-- server.js
|       |-- config/
|       |   `-- db.js
|       |-- constants/
|       |-- controllers/
|       |-- middlewares/
|       |-- models/
|       |-- routes/
|       |-- seeds/
|       |-- services/
|       |-- utils/
|       `-- validators/
|-- frontend/
|   |-- .env.example
|   |-- public/
|   `-- src/
|       |-- App.jsx
|       |-- index.css
|       |-- main.jsx
|       |-- api/
|       |-- assets/
|       |-- components/
|       |   |-- common/
|       |   |-- layout/
|       |   `-- ui/
|       |-- contexts/
|       |-- features/
|       |   |-- auth/
|       |   |-- dashboard/
|       |   |-- projects/
|       |   `-- tasks/
|       |-- hooks/
|       |-- layouts/
|       |-- lib/
|       |-- pages/
|       |-- routes/
|       `-- utils/
|-- models/
|-- .env
|-- package.json
|-- package-lock.json
`-- server.js
```

The existing root backend files are intentionally left in place during step 1.
The next step will move implementation into `backend/` and build the React app in `frontend/`.
