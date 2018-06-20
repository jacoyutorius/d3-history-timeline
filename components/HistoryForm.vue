<template>
  <div>
    <div v-if="error">
      <b-container fluid>
        <b-alert show variant="danger">
          <h4 class="alert-heading">{{error.code}}</h4>
          <hr>
          <p>{{error.message}}</p>
        </b-alert>
      </b-container>
    </div>

    <h3>new History</h3>

    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="inputCategoryGroup"
                    label="Category"
                    label-for="inputCategory">
        <b-form-select id="inputCategory"
                      :options="categories"
                      required
                      v-model="form.category">
        </b-form-select>
      </b-form-group>

      <b-form-group id="inputTitleGroup"
                    label="Name / Title"
                    label-for="inputTitle"
                    description="人物、または組織の名前">
        <b-form-input id="inputTitle"
                      type="text"
                      v-model="form.title"
                      required
                      placeholder="name or title"
                      ></b-form-input>              
      </b-form-group>

      <b-form-group id="inputStartGroup"
                    label="Birth year / Start year"
                    label-for="inputStart"
                    description="人物の生まれた年、または組織のできた年">
        <b-form-input id="inputStart"
                      type="number"
                      v-model="form.start"
                      required
                      placeholder="2018"
                      ></b-form-input>              
      </b-form-group>

      <b-form-group id="inputEndGroup"
                    label="Dead year / End year"
                    label-for="inputEnd"
                    description="人物の亡くなった年、または組織が無くなった年">
        <b-form-input id="inputEnd"
                      type="number"
                      v-model="form.end"
                      required
                      placeholder="2108"
                      ></b-form-input>              
      </b-form-group>

      <b-form-group id="inputBirthGroup"
                    label="Birthday"
                    label-for="inputBirth"
                    description="人物の誕生日">
        <b-form-input id="inputBirth"
                      type="date"
                      v-model="form.birth"
                      required
                      placeholder="2018.6.10"
                      ></b-form-input>              
      </b-form-group>

      <b-form-group id="inputDeadhGroup"
                    label="Dead day"
                    label-for="inputDeadh"
                    description="人物の没年月日">
        <b-form-input id="inputDeadh"
                      type="date"
                      v-model="form.dead"
                      required
                      placeholder="2118.6.10"
                      ></b-form-input>              
      </b-form-group>

      <b-form-group id="inputEventGroup">
        <label>Events</label>

        <!-- add new row -->
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Start year</th>
              <th>Content</th>
              <th><button class="btn btn-info btn-sm" v-on:click="addNewRow"><i class="fa fa-plus"></i></button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in form.events" v-bind:key="row.id">
              <td></td>
              <td><b-form-input type="number" v-model="row.start"></b-form-input></td>
              <td><b-form-input type="text" v-model="row.content"></b-form-input></td>
              <td><button class="btn btn-sm btn-danger btn-round" v-on:click="onRowDelete(row.id, $event)"><i class="fa fa-minus"></i></button></td>
            </tr>
            <tr>
              <td>
                
              </td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </b-form-group>

  

      <b-button type="button" variant="primary" v-on:click="onSubmit">Submit <span v-if="onloading"><i class="fa fa-spinner fa-spin"></i></span> </b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>

    <div>
      
    </div>
  </div>
</template>

<script>
import axios from "axios";
import uuid from "uuid";
import qs from "qs";

export default {
  name: "history-form",
  props: ["email"],
  data() {
    return {
      form: {
        title: "",
        category: "",
        start: "",
        end: "",
        birth: "",
        dead: "",
        events: [],
        checked: false
      },
      categories: ["people", "organization"],
      onloading: false,
      error: null
    };
  },
  methods: {
    async onSubmit() {
      try {
        this.onloading = true;

        // [WHY]  x-www-form-urlencodedでは
        // "No 'Access-Control-Allow-Origin' header is present on the requested resource" エラーが出て弾かれてしまう
        //  CORS preflightリクエストの際にContentTypeで弾かれている様子だが、API側でも"Access-Control-Allow-Headers"で"Content-Type"ヘッダ
        //  を許可している...
        //
        // var ret = await axios.post(
        //   "http://localhost:3000/histories/new",
        //   qs.stringify(this.form),
        //   {
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded"
        //     }
        //   }
        // );

        var ret = await axios.post(
          "http://localhost:3000/histories/new",
          JSON.stringify(this.form),
          {
            headers: {
              "Content-Type": "text/plain"
            }
          }
        );

        // console.dir(ret);
        if (ret.status === 200) {
          this.error = null;
        } else {
          this.error = {
            code: ret.data.code,
            message: ret.data.message
          };
        }
      } catch (ex) {
        console.error(ex);
        this.error = ex;
      } finally {
        this.onloading = false;
      }
    },
    onReset: () => {},
    addNewRow(e) {
      var obj = { id: uuid.v1(), start: null, content: "" };
      this.form.events.push(obj);
      // preventDefaultしないと何故か他の入力項目の入力チェックが走ってしまう
      e.preventDefault();
    },
    onRowDelete(id, e) {
      this.form.events = this.form.events.filter(row => {
        return row.id != id;
      });
      e.preventDefault();
    }
  }
};
</script>