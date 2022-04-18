import React, { useState } from 'react';

function CreateRepo() {
    const [isCreating, setIsCreating] = useState(false)
    return (
        <div>
            <CreateRepoButton type={isCreating} onClick={() => setIsCreating(!isCreating)} />
            <CreateRepoForm isVisible={isCreating} />
        </div>
    )
}

function CreateRepoButton(props) {
    return (
        <button onClick={props.onClick}>{props.type ? 'Cancel' : 'Create Repository'}</button>
    )
}

function CreateRepoForm(props) {
    if (props.isVisible)
        return (
            <form>
                <label>
                    Paper name:
                    <input type="text" name="paperTitle" />
                </label>
                <p />
                <label>
                    Dataset Link:
                    <input type="text" name="dataSetLink" />
                </label>
                <p />
                <input type="submit" value="Submit" />
            </form >
        )
    else return (
        <div />
    );
}

export default CreateRepo;