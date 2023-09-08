import {
    Card,
    Input,
    Button,
    Typography,
    Select,
    Option
  } from "@material-tailwind/react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as React from 'react';
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useEffect } from "react";


//NEEDED INFO:
//Start date, end date, calendar, bu username, bu password

const CalendarForm = () => {
    // const [searchParams] = useSearchParams();
    const [startDate, setStartDate] = useState(dayjs('2022-04-17'));
    const [endDate, setEndDate] = useState(dayjs('2022-04-17'));
    const [calendarNames, setCalendarNames] = useState([]);
    const [chosenCalendar, setChosenCalendar] = useState('');
    const [inserted, setInserted] = useState(false);
    const [disableSubmitButton, setDisableSubmitButton] = useState(false);
    const [failed, setFailed] = useState(false);
    const [emptyForm, setEmptyForm] = useState(false);

    const { state } = useLocation();
    //console.log(state.list);

    useEffect(() => {
        var temp = Object.keys(state.list).sort()
        //console.log(temp)
        setCalendarNames(temp);
    }, [state.list])

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        setDisableSubmitButton(true);
        setFailed(false);
        setEmptyForm(false);
    
        // Read the form data
        const form = e.target;

        if (!form.username.value || !form.password.value || !startDate || !endDate) {
            console.log('fill out the form')
            setEmptyForm(true);
            setDisableSubmitButton(false);
            return
        }

        console.log("submitted")

        axios({
            method: 'post',
            url: '/api/getList',
            crossOrigin: true,
            data: {
                username: form.username.value,
                password: form.password.value,
                startDate: (startDate.subtract(1, 'day')).toISOString(),
                endDate: endDate.toISOString().split("T")[0].replaceAll("-", "") +"T170000Z",
                chosenCalendar: chosenCalendar,
            }
        })
            .then((response) => {
                console.log(response)
                //Inserting into calendar
                axios({
                    method: 'post',
                    url: '/api/insertEvents',
                    crossOrigin: true,
                    data: {events: response.data, chosenCalendarId: state.list[chosenCalendar]}
                })
                    .then((r) => {
                        console.log(r)
                        setInserted(true);
                        setDisableSubmitButton(false);
                        
                    }, (error) => {
                        console.log(error);
                        setDisableSubmitButton(false);
                        setFailed(true);
                    });

            }, (error) => {
                console.log(error);
                setDisableSubmitButton(false);
                setFailed(true)
            });
    
      }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Card color="transparent" shadow={true} className="w-84 sm:w-100 lg:mx-[35vw] justify-center items-center mt-8">
                    <Typography variant="h4" color="blue-gray">
                        Calendar Info
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Enter your information and credentials
                    </Typography>
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 items-center" onSubmit={handleSubmit}>
                        <div className="mb-4 flex flex-col gap-6">
                            <Input size="lg" name='username' label="BU Username" />
                            <Input size="lg" name='password' type='password' label="BU Password" />
                            <DatePicker name="startDate" label="Start Date" onChange={(newValue) => setStartDate(newValue)}/>
                            <DatePicker name="endDate" label="End Date" onChange={(newValue) => setEndDate(newValue)}/>
                            <Select
                                label='Calendar'
                                onChange={(newValue) => setChosenCalendar(newValue)}
                            >
                                {calendarNames.map((name) => (
                                    <Option key={name} value={name}>{name}</Option>
                                ))}
                            </Select>
                        </div>
                        <Button className="mt-6" fullWidth type='submit' label="createEvents" disabled={disableSubmitButton}>
                            Create Events
                        </Button>
                    </form>
                    <Typography className="mt-1 text-sm font-black">
                        Your information is not saved or logged
                    </Typography>
                    {emptyForm ? (<Typography color="red" variant='h2' className="mt-1 mb-4 text-2xl justify-center mb-8">
                        Fill out the form
                    </Typography>) : (<div></div>)}
                    {inserted ? (<Typography color="green" variant='h4' className="mt-4 text-4xl justify-center mb-8">
                        Success
                    </Typography>) : (<div></div>)}
                    {failed ? (<Typography color="red" variant='h4' className="mt-4 text-4xl justify-center mb-8">
                        Failed
                    </Typography>) : (<div></div>)}
                </Card>
            </LocalizationProvider>
        </div>
    );
}

export default CalendarForm;