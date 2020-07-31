<template>
  <div id="app">
      <b-container class="vh-100" fluid>
        <b-row class="h-100" style="background-color: green">
          <b-col class="shadow bg-white" md="auto" style="overflow-y: auto;">
           <SideBarLayout></SideBarLayout>
          </b-col>
          <b-col style="background-color:whitesmoke">
            <MainLayout></MainLayout>
          </b-col>
        </b-row>
      </b-container>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>


import MainLayout from "./components/layout/MainLayout";
import SideBarLayout from "./components/layout/SideBarLayout";
export default {
  components: { SideBarLayout, MainLayout  },
};
</script>
