import { initializeApp } from "firebase/app";
import {
  getDatabase,
  set,
  ref,
  push,
  increment,
  update,
} from "firebase/database";

export default class Database {
  // Your web app's Firebase configuration
  private static firebaseConfig = {
    apiKey: 
    authDomain: 
    projectId: 
    databaseURL:
      
    storageBucket: 
    messagingSenderId: 
    appId: 
  };

  private static getDB() {
    const app = initializeApp(this.firebaseConfig);
    return getDatabase(app);
  }

  // get question ref
  static getQuestionRef() {
    const db = this.getDB();
    return ref(db, "questions/");
  }

  static addVote(id: string) {
    const db = this.getDB();
    const data = { votes: increment(1) };
    update(ref(db, "questions/" + id), data);
  }

  static deleteQuestion(id: string) {
    const db = this.getDB();
    set(ref(db, "questions/" + id), null);
  }

  static addQuestion(question: string) {
    const db = this.getDB();
    const qRef = ref(db, "questions/");
    const newQuestion = push(qRef);
    return set(newQuestion, {
      question: question,
      votes: 0,
    });
  }
}
