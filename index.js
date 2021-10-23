var app = new Vue({
  el: "#app",
  data: {
    source: [],
    query: '',
    selected: {
      id: null,
      name: null,
      email: null,
      role: null,
    },
    totalPages: 1,
    currentPage: 1,
    deleteList: [],
    deleteAll: false,
  },
  methods: {
    setSource: function (data) {
      let users = {};
      for (user of data) {
        users[user.id] = user;
      }
      this.source = { ...users };
    },
    selectUser: function(index, id){
      this.selected = {...this.source[id]};
    },
    deleteUser: function(id){
      this.$delete(this.source, id)
    },
    saveUser: function(){
      this.$set(this.source, this.selected.id, this.selected);
    },
    watchFunc: function(){
      if(this.deleteAll){
        let index = (this.currentPage-1)*10;
        for(user of this.dataSet.slice(index, index+10)){
          this.deleteList.push(Number(user.id));
        }
      }else{
        this.deleteList = [];
      }
    },
    resetDeletes: function(){
      this.deleteList = [];
      this.deleteAll = false;
    },
    deleteMultiple: function(){
      if(this.deleteList.length>0){
        for(id of this.deleteList){
          this.deleteUser(id);
        }
        this.deleteList = [];
        this.deleteAll = false;
      }
    }
  },
  computed: {
    dataSet: {
        get: function(){
            let query = this.query.toLowerCase();
            let filteredUsers = Object.values(this.source).filter((user)=> {
                return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || user.role.toLowerCase().includes(query)
            });
            let total = filteredUsers.length;
            this.totalPages = total > 0 ?  Math.ceil(total/10) : 1;
            this.currentPage = 1;
            return filteredUsers;
        }
    },
  },
  mounted: function () {
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    .then(response => (this.setSource(response.data)));
    // this.setSource(data);
    document.addEventListener("DOMContentLoaded", function () {
      var elems = document.querySelectorAll(".modal");
      var instances = M.Modal.init(elems);
    });
  },
});