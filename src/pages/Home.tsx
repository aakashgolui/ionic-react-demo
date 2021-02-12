import {
  IonContent,
  IonPage,
  IonText,
  IonInput,
  IonButton,
  IonToast,
  IonItem, IonLabel,
  IonProgressBar,
  IonToolbar, IonTitle, IonButtons, IonIcon
} from "@ionic/react";
import { pencil, close } from 'ionicons/icons';
import {
  Controller
} from "react-hook-form";
import React from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import axios from 'axios'
const Home: React.FC = () => {
  //form validation schema
  const validationSchema = object().shape({
    email: string().required().email(),
    name: string().required().min(5).max(32),
    password: string().required().min(8),
  });

  //form handlers
  const { control, handleSubmit, errors } = useForm({
    validationSchema,
  });

  //variables
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false); //toast show/hide
  const [toastText, settoastText] = React.useState(''); //toast message
  const [isLoading, setIsLoading] = React.useState(true); //api data loading
  const [userData, setUserData]: any = React.useState({ //user data

  });

  //form object
  const formFields = [
    {
      name: "email",
      component: <IonInput type="email" disabled={!isEditMode} />,
      label: "Email"
    },
    {
      name: "name",
      component: <IonInput type="text" disabled={!isEditMode} />,
      label: "Full Name"
    },
    {
      name: "password",
      component: <IonInput type="password" disabled={!isEditMode} clearOnEdit={false} />,
      label: "Password"
    },
  ];

  //initialize axios
  const api = axios.create({
    baseURL: `http://projectsshowcase.com/demo-project/public/api`,
  });

//get user data from api on document load
  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/get-users')
        if (res.status === 200) {
          setUserData(res.data.data.users[0])
          setIsLoading(false)
        } else {
          setIsLoading(false)
          toggleToast('Cannot perform user update');
        }
      }
      catch (err) {
        toggleToast('Cannot load user data')
        setIsLoading(false)
      }
    }
    loadData()
    console.log(userData)
  }, [setUserData])

  // show toast with message
  const toggleToast = (text: string) => {
    settoastText(text);
    setShowToast(!showToast);
  }

  //submit update user
  const updateUser = async (data: any) => {
    console.log("creating a new user account with: ", data);
    try {

      const res = await api.patch(`/edit-user/${userData.id}`, data)
      console.log(res)
      if (res.status === 200) {
        toggleToast('User updated successfully!');
        setIsEditMode(false)
      } else {
        toggleToast('Cannot perform user update');
      }
    }
    catch (err) {
      toggleToast('Cannot perform user update');
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="ion-padding">

          <IonToolbar>

            <IonButtons slot="secondary">
              <IonButton onClick={() => setIsEditMode(!isEditMode)}>
                <IonIcon slot="icon-only" icon={!isEditMode ? pencil : close} />
              </IonButton>
            </IonButtons>
            <IonTitle>{isEditMode ? 'Edit Profile' : 'My Profile'}</IonTitle>
          </IonToolbar>
          {isLoading && (<IonProgressBar type="indeterminate"></IonProgressBar>)}
          <br />

          <form onSubmit={handleSubmit(updateUser)}>
            {
              !isLoading &&
              formFields.map((field, index) => (
                <>
                  <IonItem>
                    {field.label && <IonLabel position="floating">{field.label}</IonLabel>}
                    <Controller
                      as={
                        field.component ?? (
                          <IonInput
                            disabled
                            aria-invalid={errors && errors[field.name] ? "true" : "false"}
                            aria-describedby={`${field.name}Error`}
                          />
                        )
                      }

                      defaultValue={userData[field.name]}
                      name={field.name}
                      control={control}
                      onChangeName="onIonChange"
                    />
                  </IonItem>
                  {errors && errors[field.name] && (
                    <IonText color="danger" className="ion-padding-start">
                      <small>
                        <span role="alert" id={`${field.name}Error`}>
                          {errors[field.name].message}
                        </span>
                      </small>
                    </IonText>
                  )}
                </>
              ))}

            {isEditMode && // button will show when edit mode on
              <IonButton expand="block" type="submit" className="ion-margin-top">
                UPDATE USER
            </IonButton>}
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