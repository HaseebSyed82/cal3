import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Popup} from 'reactjs-popup';
import Input from 'react-input';
import Button from 'react-button';
import Textarea from 'react-textarea-autosize';
import Switch from 'react-switch';
import Eventcalendar from 'react-event-calendar';
import Datepicker from 'react-date-picker';
import {SegmentedGroup} from 'react-segment';
import {SegmentedItem} from 'react-segment';


const now = new Date();
const defaultEvents = [{
        id: 1,
        start: new Date(now.getFullYear(), now.getMonth(), 8, 13),
        end: new Date(now.getFullYear(), now.getMonth(), 8, 13, 30),
        title: 'Lunch @ Butcher\'s',
        color: '#26c57d'
    }, {
        id: 2,
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16),
        title: 'General orientation',
        color: '#fd966a'
    }, {
        id: 3,
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 22),
        title: 'Dexter BD',
        color: '#37bbe4'
    }, {
        id: 4,
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30),
        title: 'Stakeholder mtg.',
        color: '#d00f0f'
    }];

    const viewSettings = {
      calendar: { labels: true }
  };
  const responsivePopup = {
      medium: {
          display: 'anchored',
          width: 400,
          fullScreen: false,
          touchUi: false
      }
  };
  let tempId = 4;   

  function App() {
    const [myEvents, setMyEvents] = React.useState(defaultEvents);
    const [tempEvent, setTempEvent] = React.useState(null);
    const [isOpen, setOpen] = React.useState(false);
    const [isEdit, setEdit] = React.useState(false);
    const headerText = React.useMemo(() => isEdit ? 'Edit event' : 'New Event', [isEdit]);
    const [anchor, setAnchor] = React.useState(null);
    const [arrow, setArrow] = React.useState(false);
    const [start, startRef] = React.useState(null);
    const [end, endRef] = React.useState(null);
    const [deleteEvent, setDeleteEvent] = React.useState(false);
    const [restoreEvent, setRestoreEvent] = React.useState(false);
    const getEventIndex = (id: string) => {
        return myEvents.findIndex(x => x.id === id);
    };
    const updateEventInList = (partial) => {
        const index = getEventIndex(tempEvent.id);
        const newEventList = [...myEvents];
        
        newEventList.splice(index, 1, { ...myEvents[index], ...partial });
        setMyEvents(newEventList);
    };
    const popupButtons = React.useMemo(() => {
        if (isEdit) {
            return [
                'cancel',
                {
                    handler: () => {
                        setOpen(false);
                    },
                    keyCode: 'enter',
                    text: 'Save',
                    cssClass: 'mbsc-popup-button-primary'
                }
            ];
        }
        else
        {
            return [
                'cancel',
                {
                    handler: () => {
                        setTempEvent(null);
                        setOpen(false);
                    },
                    keyCode: 'enter',
                    text: 'Add',
                    cssClass: 'mbsc-popup-button-primary'
                }
            ];
        }
    }, [tempEvent, updateEventInList, setOpen, isEdit]);
    
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const titleChange = (ev) => {
        const newTitle = ev.target.value;
        setTitle(newTitle);
        updateEventInList({ title: newTitle });
    };
    const descriptionChange = (ev) => {
        const newDesc = ev.target.value;
        setDescription(newDesc);
        updateEventInList({ description: newDesc });
    };
    const [allDay, setAllDay] = React.useState(false);
    const allDayChange = (ev) => {
        const allDay = ev.target.checked;
        setAllDay(allDay);
        updateEventInList({ allDay: allDay });
    }
    const controls = React.useMemo(() => allDay ? ['date'] : ['datetime']);
    const respSetting = React.useMemo(() => allDay ? {
        medium: {
            controls: ['calendar'],
            touchUi: false
        }
    } : {
        medium: {
            controls: ['calendar', 'time'],
            touchUi: false
        }
    });

    const [date, setDate] = React.useState([]);
    const dateChange = (args) => {
        const d = args.value;
        
        setDate(d);
        updateEventInList({ start: d[0], end: d[1] });
        
    };
    const [free, setFree] = React.useState(true);
    const statusChange = (ev) => {
        const free = ev.target.value === 'free';
        setFree(free);
        updateEventInList({ free: free });
    };
    const removeEvent = () => {
        setMyEvents(myEvents.filter(el => el.id !== tempEvent.id));
        setOpen(false);
        toast({
            message: 'Event deleted'
        });
    };
    const fillPopup = (e) => {
        setTitle(e.title);
        setDescription(e.description);
        setDate([e.start, e.end]);
        setAllDay(e.allDay || false);
        setFree(e.free);
    };
    const createNewEvent = (newEvent, elm) => {
        // define action on popup close
        setDeleteEvent(true);
        setRestoreEvent(false);
        setTempEvent({ ...newEvent });
        fillPopup(newEvent);
        setMyEvents([...myEvents, newEvent]);
        setEdit(false);
        setAnchor(elm);
        setArrow(true);
        setOpen(true);
    };
    const onClose = () => {
        if (deleteEvent) {
            setMyEvents(myEvents.filter(item => item.id !== tempEvent.id));
        } else if (restoreEvent) {
            updateEventInList({ ...tempEvent });
        }
        setTempEvent(null);
        setOpen(false);
    };
    const positionPopup = () => {

    };
    const onEventClick = (args) => {
        if(!isOpen) {
            const e = args.event;
            setTempEvent({ ...e });
            // show delete button inside edit popup
            setEdit(true);
            
            // define action on popup close
            setDeleteEvent(false);
            setRestoreEvent(true);

            // fill popup with the selected event data
            fillPopup(args.event);
            
            setAnchor(args.domEvent.target);
            setOpen(true);
        }
    };
    const onEventCreated = (args) => {
        createNewEvent(args.event, args.target)
    };
    const onEventDeleted = (args) => {
        setMyEvents(myEvents.filter(item => item.id !== args.event.id));
        setTimeout(() => {
            toast({
                message: 'Event deleted'
            });            
        });
    };
    return <div>
        <Eventcalendar
            view={viewSettings}
            data={myEvents}
            clickToCreate="double"
            dragToCreate={true}
            dragToMove={true}
            dragToResize={true}
            onEventClick={onEventClick}
            onEventCreated={onEventCreated}
            onEventDeleted={onEventDeleted}
        />
        <Popup
            display="bottom"
            fullScreen={true}
            contentPadding={false}
            headerText={headerText}
            anchor={anchor}
            buttons={popupButtons}
            isOpen={isOpen}
            onClose={onClose}
            responsive={responsivePopup}
            showArrow={arrow}
        >
            <div className="mbsc-form-group">
                <Input label="Title" value={title} onChange={titleChange} />
                <Textarea label="Description" value={description} onChange={descriptionChange} />
            </div>
            <div className="mbsc-form-group">
                <Switch label="All-day" checked={allDay} onChange={allDayChange} />
                <Input ref={startRef} label="Starts" />
                <Input ref={endRef} label="Ends" />
                <Datepicker
                    select="range"
                    controls={controls}
                    touchUi={true}
                    startInput={start}
                    endInput={end}
                    showRangeLabels={false}
                    responsive={respSetting}
                    onChange={dateChange}
                    value={date}
                />
                <SegmentedGroup onChange={statusChange}>
                    <SegmentedItem value="busy" checked={!free}>Show as busy</SegmentedItem>
                    <SegmentedItem value="free" checked={free}>Show as free</SegmentedItem>
                </SegmentedGroup>
                {isEdit ? <div className="mbsc-button-group"><Button className="mbsc-button-block" color="danger" variant="outline" onClick={removeEvent}>Delete event</Button></div> : null}
            </div>
        </Popup>
    </div>
}


export default App;
