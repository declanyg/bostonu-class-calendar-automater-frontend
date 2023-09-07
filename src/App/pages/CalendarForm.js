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
    
        // Read the form data
        const form = e.target;
        const submitData = {
            username: form.username.value,
            password: form.password.value,
            startDate: (startDate.subtract(1, 'day')).toISOString(),
            endDate: endDate.toISOString().split("T")[0].replaceAll("-", "") +"T170000Z",
            chosenCalendar: chosenCalendar,
        }
        console.log(submitData)

        axios({
            method: 'post',
            url: 'https://calendar-automater-api-production.up.railway.app/api/getList',
            crossOrigin: true,
            data: submitData
        })
            .then((response) => {
                console.log(response)
                //Inserting into calendar
                axios({
                    method: 'post',
                    url: 'https://calendar-automater-api-production.up.railway.app/api/insertEvents',
                    crossOrigin: true,
                    data: {events: response.data, chosenCalendarId: state.list[chosenCalendar]}
                })
                    .then((r) => {
                        console.log(r)
                        setInserted(true);
                        
                    }, (error) => {
                        console.log(error);
                    });

            }, (error) => {
                console.log(error);
            });
    
      }

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Card color="transparent" shadow={true} className="w-[29%] mx-[35%] justify-center items-center mt-8">
                    <Typography variant="h4" color="blue-gray">
                        Calendar Info
                    </Typography>
                    <Typography color="gray" className="mt-1 font-normal">
                        Enter your information
                    </Typography>
                    <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleSubmit}>
                        <div className="mb-4 flex flex-col gap-6">
                            <Input size="lg" name='username' label="Username" />
                            <Input size="lg" name='password' type='password' label="Password" />
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
                        <Button className="mt-6" fullWidth type='submit' label="endDate">
                            Create Events
                        </Button>
                        {inserted ? (<Typography color="green" variant='h4' className="mt-1 text-4xl">
                        Success
                    </Typography>) : (<div></div>)}
                    </form>
                </Card>
            </LocalizationProvider>
        </div>
    );
}

export default CalendarForm;