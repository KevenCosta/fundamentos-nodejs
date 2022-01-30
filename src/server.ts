import express from 'express'
import { createCourse } from './routes';
import {categoriesRoutes} from './routes/categories.routes'
const app = express()
app.use(express.json())
app.use(categoriesRoutes)
app.get('/', createCourse);
app.listen(3333)