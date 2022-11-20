import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';
import {Button, TextField} from "@mui/material";

type AddItemFormPropsType = {
    callback: (title: string) => void
}
const AddItemForm: FC<AddItemFormPropsType> = ({callback}) => {
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== '') {
            callback(title)
            setTitle('')
        } else {
            setError('Title is required')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (event.key === 'Enter') {
            addItem()
        }
    }

    return (
        <div>
            <TextField
                id="outlined-basic"
                label="Add Title"
                variant="outlined"
                helperText={error}
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                error={!!error}
            />
            <Button style={{
                maxWidth: '30px',
                minWidth: '30px',
                maxHeight: '30px',
                minHeight: '30px',
                backgroundColor: 'grey'
            }} onClick={addItem} variant="contained">+</Button>
        </div>
    );
};

export default AddItemForm;