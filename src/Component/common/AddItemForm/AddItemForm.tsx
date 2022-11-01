import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';

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
        if (event.key === 'Enter'){
            addItem()
        }
    }

    return (
        <div>
            <input
                value={title}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                className={error ? 'error' : ''}
            />
            <button onClick={addItem}>+</button>
            {error && <div className='error-message'>{error}</div>}
        </div>
    );
};

export default AddItemForm;