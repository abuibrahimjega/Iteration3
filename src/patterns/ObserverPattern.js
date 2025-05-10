// src/patterns/ObserverPattern.js
export class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
    return () => this.unsubscribe(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

// Usage example:
// const userActivitySubject = new Subject();
// const unsubscribe = userActivitySubject.subscribe(activity => {
//   logUserActivity(activity);
// });
// userActivitySubject.notify({ type: 'login', timestamp: new Date() });
