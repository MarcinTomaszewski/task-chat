class UsersService {
    constructor() {     //konstruktor inicjalizujący tablicę użytkowników 
        this.users = [];
    }
    //zadaniem tej metody jest zwrócenie tablicy użytkowników,
    getAllUsers() {
        return this.users;
    }
    //ta metoda zajmuje się odszukaniem użytkownika po wskazanym przez nas id. W tym przykładzie korzystamy z metody find, w której z wykorzystaniem arrow function szukamy użytkownika posiadającego identyczne id do wskazanego w argumencie metody — userId,
    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }
    //dzięki tej metodzie możemy dodać kolejna osobę do listy
    addUser(user) {
        this.users = [user, ...this.users];
    }
    //ta metoda przy pomocy array.prototype.filter usuwa wskazanego użytkownika
    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
    }
}
module.exports = UsersService;