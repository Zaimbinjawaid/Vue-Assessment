import axios from "axios";

export const auth = {
  login(loginObj) {
    return axios
      .post(`/login`, loginObj)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  register(registerObj) {
    return axios
      .post(`/register`, registerObj)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  logout(token) {
    return axios
      .post(`/logout`, token)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  toDo(toDoObj) {
    return axios
      .post(`/item`, toDoObj)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  updateToDo(id, obj) {
    return axios
      .put(`/item/${id}`, obj)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  deleteToDo(id) {
    return axios
      .delete(`/item/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  getSingleToDo(id) {
    return axios
      .get(`/item/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },

  getToDoList() {
    return axios
      .get(`/items`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return { error };
      });
  },
};
