import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Grid, TextField } from '@mui/material';
import moment from 'moment'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    // p: 4,
};

const Create = ({ onClose, tid, data = {}, sendMsg, updateStatus, userType = 'seller', createTicket, createNew, userId }) => {
    const [msg, setMsg] = useState('')

    const scrollToBottom = useCallback((node) => {
        if (node) {
            let cr = node.getBoundingClientRect()
            node.scroll({ top: cr.bottom * cr.height })
        }
    })

    return (
        <div>
            <Modal
                open
                onClose={onClose}
                aria-labelledby="support-ticket"
                aria-describedby="support-ticket-updates"
            >
                <Box sx={style} className='msg-container'>
                    <Grid container display='flex' direction='row' alignItems='center' justifyContent='space-evenly' sx={{ p: 2 }}>
                        {userType === 'admin' && <>
                            <Button variant='contained' disabled={data.status === 'open'} onClick={() => updateStatus(tid, 'open')}>
                                {data.status === 'open' ? 'Opened' : 'Open'}
                            </Button>
                            <Button variant='contained' color='error' disabled={data.status === 'close'} onClick={() => updateStatus(tid, 'close')}>
                                Close
                            </Button>
                        </>
                        }
                        {data.status && <Typography variant='h6' component='p'>Status : {data.status}</Typography>}
                    </Grid>
                    <Grid
                        ref={scrollToBottom}
                        className='hidescroll'
                        sx={{
                            maxHeight: '500px',
                            overflow: 'hidden auto',
                            p: 4,
                            pb: 0,
                            position: 'relative',
                            bottom: 0
                        }}>
                        {data.messages ? data.messages.map((msg, i) =>
                            <Grid key={i} sx={{ mb: 2 }}>
                                <Grid container display='flex' direction={msg.senderId === userId ? 'row' : 'row-reverse'} justifyContent='space-between'>{/** row-reverse */}
                                    <Typography variant={"subtitle1"} component="span">
                                        {moment(msg.createdAt).format('llll')}
                                    </Typography>
                                    <Typography variant={"h6"} component="span" style={{
                                        color: msg.senderId !== userId ? 'blue' : 'inherit'
                                    }}>
                                        {
                                            msg.senderId === userId ? 'Me' :
                                                userType === 'admin' ?
                                                    data.user.username :
                                                    'Support'
                                        }
                                    </Typography>
                                </Grid>
                                <Typography className={`msg ${msg.senderId === userId ? 'sb1' : 'othermsg sb2'}`} >{msg.text}</Typography>
                            </Grid>
                        ) : <Typography className="msg sb1" sx={{ mb: 2 }}>No ticket created yet!</Typography>
                        }
                    </Grid>
                    <Grid>
                        <TextField
                            multiline
                            placeholder='type message here...'
                            fullWidth
                            inputProps={{
                                style: { borderRadius: 0 }
                            }}
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                        />
                        <Button variant='contained' fullWidth onClick={() => {
                            if (createNew) createTicket(msg)
                            else {
                                setMsg('')
                                sendMsg(msg)
                            }
                        }}>{createNew ? 'Create' : 'Send'}</Button>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}

export default Create
