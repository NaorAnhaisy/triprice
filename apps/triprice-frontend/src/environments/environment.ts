export const environment = {
  production: false,
  BACKEND_URL:
    process.env['NODE_ENV'] === 'production'
      ? 'https://triprice.cs.colman.ac.il/api'
      : 'http://localhost:3333/api',
       firebaseConfig: {
        apiKey: "AIzaSyB7XXCVcgXNSZnh_4QXV3y-JQX3x113Rgs",
        authDomain: "triprice-cs.firebaseapp.com",
        projectId: "triprice-cs",
        storageBucket: "triprice-cs.appspot.com",
        messagingSenderId: "1082605640548",
        appId: "1:1082605640548:web:bc43f0168e59532c357871"
      },
};
