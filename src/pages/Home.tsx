import {
  IonContent,
  IonPage,
  IonText,
  IonInput,
  IonButton, 
  IonToast,  
  useIonViewDidEnter 
} from "@ionic/react";
import React from "react";
import { useForm } from "react-hook-form";
import Input, { InputProps } from "../components/Input";
import { object, string } from "yup";
import axios from 'axios'
const Home: React.FC = () => {
  //form validation schema
  const validationSchema = object().shape({
    email: string().required().email(),
    fullName: string().required().min(5).max(32),
    password: string().required().min(8),
  });

  //form handlers
  const { control, handleSubmit, errors } = useForm({
    validationSchema,
  });

  //user data
  const [userData, setUserData] = React.useState({
    email: "akash.golui@gmail.com",
    fullName: "Akash Golui",
    password: "12345678"
  });
//toast variable
const [showToast, setShowToast] = React.useState(false);
const [toastText, settoastText] = React.useState('');

  //form object
  const formFields: InputProps[] = [
    {
      name: "email",
      component: <IonInput type="email" />,
      label: "Email",
      value: userData['email']
    },
    {
      name: "fullName",
      label: "Full Name",
      value: userData['fullName']
    },
    {
      name: "password",
      component: <IonInput type="password" clearOnEdit={false} />,
      label: "Password",
      value: userData['password']
    },
  ];

  //initialize axios
  const api = axios.create({
    baseURL: `http://localhost:3000/`,
  });
  //submit update user
  const updateUser = (data: any) => {
    console.log("creating a new user account with: ", data);
  };

  //it calls after view load
  useIonViewDidEnter(()=>{
    console.log(userData)
    api.get('/getUser')
    .then((res)=>{
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
      toggleToast('Cannot load user data')
    })
  })

  const toggleToast = (text: string) => {
    settoastText(text);
    setShowToast(!showToast);
  }

  return (
    <IonPage>
      <IonContent>
        <div className="ion-padding">
          <IonText color="muted">
            <h2>Edit Profile</h2>
          </IonText>

          <form onSubmit={handleSubmit(updateUser)}>
            {formFields.map((field, index) => (
              <Input {...field} {...userData} control={control} key={index} errors={errors} />
            ))}

            <IonButton expand="block" type="submit" className="ion-margin-top">
              Register
            </IonButton>
          </form>
        </div>
      </IonContent>
      <IonToast
        isOpen={showToast}
        message={toastText}
        position="bottom"
        duration={2000}
      />
    </IonPage>
  );
};

export default Home;