class User {
    constructor(id, userName, email, hash){
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.hash = hash;
    }

    toJSON() {
        return {
            id: this.id,
            userName: this.userName,
            email: this.email
        }
    }
}

module.exports = User