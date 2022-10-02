import type {NextPage} from 'next'
import {styled, ThemeProvider} from "@mui/material/styles"
import theme from "../theme/theme";
import {
    Box, BoxProps,
    Card,
    CardContent,
    Container, Divider,
    Grid,
    Typography, TypographyProps
} from "@mui/material";
import {QueryClient, QueryClientProvider, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {useRouter} from "next/router";
import {format} from 'date-fns';

type EventCardProps = {
    name: string,
    interest: string,
    time: Date,
    location: string
}

type Event = {
    event_id: string,
    event_name: string,
    event_start_time: Date,
    event_creation_date: Date,
    event_duration: number,
    type_id: string,
    creater_id: string,
    types: {
        type_id: string,
        type_name: string
    },
    users: {
        "user_id": string,
        "user_name": string
    }
}

const PrimaryText = styled(Typography)<TypographyProps>(({theme}) => ({
    color: theme.palette.primary.main
}))

const EventCard = ({name, interest, time}: EventCardProps) => {
    return (
        <Card sx={{minWidth: 100}}>
            <CardContent>
                <Typography>
                    {name}
                    <PrimaryText>Is Interested In </PrimaryText>
                    {interest}
                    <PrimaryText>At </PrimaryText>
                    {format(time, 'p')}
                </Typography>
            </CardContent>
        </Card>
    )
}

const queryClient = new QueryClient();

const SectionText = styled(Typography)<TypographyProps>(({theme}) => ({
    color: theme.palette.secondary.main,
    variant: "h1",
    component: "h1"
}));

const SectionContainer = styled(Box)<BoxProps>(({theme}) => ({
    "paddingBottom": 10,
    "minHeight": "40vh"
}));

type EventSectionProps = {
    title: string,
    events?: Event[]
}
const EventSection = ({title, events}: EventSectionProps) => {
    return (
        <SectionContainer>
            <SectionText>{title}</SectionText>
            <Grid container spacing={2}>
                {
                    events && events.map(({event_id, event_name, event_start_time, users: {user_name}}) =>
                        <Grid item key={event_id}>
                            <EventCard name={user_name} interest={event_name} time={new Date(event_start_time)}
                                       location={"not implemented"}/>
                        </Grid>)
                    || <Box sx={{margin: 10}}><Typography>Nothing to show here :/</Typography></Box>
                }
            </Grid>
        </SectionContainer>
    )
};

const HomePage = () => {

    const router = useRouter();
    const {id} = router.query;

    const {data: events} = useQuery(["events"], () => axios.get('/api/booking').then<Event[]>(res => res.data.rest).catch<Event[]>())
    const {data: joinedEvents} = useQuery(["joinedEvents"], () => axios.get('/api/booking', {params: {"userjoineventid": id}}).then<Event[]>(res => res.data.res).catch<Event[]>())

    return (
        <Container>
            <Typography>{id}</Typography>
            <Box sx={{width: "100%"}}>
                <Typography variant={"h6"} component={"h6"} sx={{width: "100%", fontSize: 48}}>
                    Sup Bot
                </Typography>
            </Box>

            <EventSection title={"Join In On Someone Else!"} events={events}/>
            <Divider/>
            <EventSection title={"Interests That You Are Following"} events={joinedEvents}/>
        </Container>
    )
}

const Home: NextPage = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <HomePage/>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default Home
