import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
    constructor(props) {        //początkowy stan aplikacji
        super(props);
        this.state = { users: [], messages: [], text: '', name: '' };
        /*W stanie początkowym aplikacji przydadzą się nam:
            USERS — użytkownicy, których wyświetlaniem zajmie się komponent UsersList
            MESSAGES — wiadomości, które przekażemy komponentowi MessagesList
            TEXT — nasza wiadomość, którą będziemy chcieli wysłać
            NAME — imię, które wybraliśmy sobie podczas pierwszego wejścia do czatu*/
    }
    //funkcje nasłuchujące na wiadomość typu update i massage. Ujęte w metodzie componentDidMount
    componentDidMount() {// dobre miejsce  na aktualizacje stanu komponentu.
        socket.on('message', message => this.messageReceive(message)); //na zdarzenie massage wywoła się metoda messageReceive
        socket.on('update', ({ users }) => this.chatUpdate(users)); // na zdarzenie update wykona sie metoda chatUpdate
    }

    messageReceive(message) { //metoda odbiera wiadomości, a następnie aktualizuje stan wiadomości.
        const messages = [message, ...this.state.messages];
        this.setState({ messages });
    }

    chatUpdate(users) {
        this.setState({ users });
    }

    handleMessageSubmit(message) {  //metoda wysyła wiadomość do serwera. Zanim wyślemy wiadomość aktualizuje się bieżący stan aplikacji i emituje się wysłaną wiadomość dla wszystkich użytkowników.
        const messages = [message, ...this.state.messages];
        this.setState({ messages });
        socket.emit('message', message);
    }

    handleUserSubmit(name) {    //metoda obsługuje tworzenie nowego użytkownika czatu i wysyła informacje do serwera i powiadamia reszta  o nowym użytkowniku.
        this.setState({ name });
        socket.emit('join', name);
    }

    render() {
        //operator ternarny - <warunek_do_sprawdzenia> ? <przypadek_true> : <przypadek_false>
        return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
    }

    renderLayout() {    //metoda wyświetla części layoutu
        return (
            <div className={styles.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        ChatApp
                    </div>
                    <div className={styles.AppRoom}>
                        App room
                    </div>
                </div>
                <div className={styles.AppBody}>
                    <UsersList
                        users={this.state.users}
                    />
                    <div className={styles.MessageWrapper}>
                        <MessageList
                            messages={this.state.messages}
                        />
                        <MessageForm
                            onMessageSubmit={message => this.handleMessageSubmit(message)} //przekazanie metody handelMessageSubmit(jako parametr przyjmuje imie-nick.)
                            name={this.state.name}
                        />
                    </div>
                </div>
            </div>
        );
    }
    renderUserForm() {  //metoda odpowiadająca za wyswietlenie formularza użytkownika
        //komponent UserForm przyjmuje tylko props onUserSubmit, który obsługuje potwierdzenie wejścia użytkownika do czatu. Przekazanie metody handelMessageSubmit(jako parametr przyjmuje imie-nick.).
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)    
    }
};

export default hot(module)(App);