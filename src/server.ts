import app from './app'
import * as dotenv from 'dotenv'


dotenv.config()

const PORT = parseInt(process.env.PORT || '8080') 
const starter = new app()

starter.startApp(PORT)
.then(port => console.log(`Running on http://localhost:${port}`))
.catch(err => {
    console.log(err);
})

export default starter