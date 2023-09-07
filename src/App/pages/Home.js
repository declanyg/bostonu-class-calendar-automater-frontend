import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Button } from '@material-tailwind/react';
import GoogleImage from '../../google.svg';

const Home = () => {

    const navigate = useNavigate();
    const openForm = (response) => {
        console.log(response);
        
        axios({
            method: 'post',
            url: 'https://calendar-automater-api-production.up.railway.app/api/getCalendars',
            crossOrigin: true,
            data: response
        })
            .then((calendarsResponse) => {
                console.log(calendarsResponse)
                navigate('./form', {state: {list: calendarsResponse.data}})
            }, (error) => {
                console.log(error);
            });

    };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => openForm(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });
 
    return (
        <div className="flex flex-col items-center space-y-4 mt-8">
          <h1 className='text-black font-bold text-3xl'>Project Home</h1>
          <Button
            size="lg"
            variant="outlined"
            color="blue-gray"
            className="flex items-center gap-3"
            onClick={() => login()}
            >
            <img src={GoogleImage} alt="metamask" className="h-6 w-6" />
                Sign into Google
            </Button>
        </div>
        );
}

export default Home;