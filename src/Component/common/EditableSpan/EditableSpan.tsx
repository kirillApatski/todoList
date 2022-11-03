import React, {ChangeEvent, FC, useState} from 'react';
import {TextField} from "@mui/material";

type EditableSpanType = {
    value: string
    onChange: (newTitle: string) => void
}

export const EditableSpan: FC<EditableSpanType> = (
    {
        value,
        onChange
    }
) => {
    console.log('EditableSpan called');
    let [editMode, setEditMode] = useState(false);
    let [title, setTitle] = useState(value);

    const activateEditMode = () => {
        setEditMode(true);
        setTitle(value);
    }
    const activateViewMode = () => {
        setEditMode(false);
        onChange(title);
    }
    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <TextField id="outlined-basic" label="Outlined" variant="outlined" value={title} onChange={changeTitle}
                     onBlur={activateViewMode} autoFocus/>
        : <span onDoubleClick={activateEditMode}>{value}</span>
};

