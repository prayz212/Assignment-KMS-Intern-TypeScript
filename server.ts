import app from './app'

const PORT = parseInt(process.env.PORT || '8080') 
const starter = new app()

starter.startApp(PORT)
.then(port => console.log(`Running on http://localhost:${port}`))
.catch(err => {
    console.log(err);
    
})