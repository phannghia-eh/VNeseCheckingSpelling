import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import 'isomorphic-fetch';

interface iCheckSpelling {
    words: WordPhrase;
    loading: boolean;
}

export class CheckSpelling extends React.Component<RouteComponentProps<{}>, iCheckSpelling> {
    constructor() {
        super();
        this.state = { words: { word: "Done...", isWord: true}, loading: true };

        fetch('api/CheckSpelling/WordPhrases')
            .then(response => response.json() as Promise<WordPhrase>)
            .then(data => {
                this.setState({ words: data, loading: false });
            });
    }

    public SendWord() {
        fetch('api/CheckSpelling/GetWord', {
            method: "POST",
            body: JSON.stringify({
                Word: this.state.words.word
            })
        }).then(response => response.json() as Promise<WordPhrase>)
            .then(data => {
                this.setState({ words: data, loading: false });
            });
    }

    public render() {
        let contents = this.state.loading
            ? "Loading..."
            : this.state.words.word;
        let isWord = this.state.loading
            ? ""
            : this.state.words.isWord
            ? "Correct"
            : "Error"
        return <div>
            <h1>Check Spelling</h1>

            <p>Give me a Word:
                <input type="text"
                    value={this.state.words.word}
                    onChange={(event) => this.updateState(event)} />
                {isWord}
            </p>

            <button onClick={() => { this.SendWord() }}>Check</button>
        </div>
    }

    public updateState(event: any) {
        this.setState({ words: { word: event.target.value, isWord: this.state.words.isWord } });
    }

}

interface WordPhrase {
    word: string;
    isWord: boolean;
}