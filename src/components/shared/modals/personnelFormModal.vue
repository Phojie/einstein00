<template>
  <q-card style="width: 900px; max-width: 90vw;">
    <q-card-section class="row no-wrap">
      <div class="text-h6">
        <slot name="headerTitle"></slot>
      </div>
      <q-space />
      <q-btn
        icon="close"
        flat
        round
        size="md"
        class="text-negative"
        v-close-popup
      />

    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row items-center ">
        <!-- <q-form
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
        > -->
        <div class="fit row wrap justify-center  content-center">
          <div class="col-md-4 col-xs-12 q-pr-md-lg">
            <q-uploader
              ref="refUploaderImage"
              label="Personnel Picture"
              flat
              class="full-width uploaderBug"
              hide-upload-btn
              bordered
              accept="image/*"
              v-on:added="$emit('added', $event)"
            >
              <template v-slot:list>
                <img
                  style="overflow:hidden !important; height:100%; width:100%"
                  :src="studentInformationForm.profileImgUrl"
                  alt=""
                >
              </template>
            </q-uploader>
          </div>
          <div class="q-pt-xs-md q-pt-md-none col-md-4 col-xs-12 q-gutter-y-sm">
            <q-input
              autofocus
              dense
              outlined
              :value="studentInformationForm.prefix"
              @input="setPrefix($event)"
              label="Prefix"
              class="text-capitalize"
              :error="validations.prefix.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.prefix.required"
              >
                Prefix is required
              </template>
            </q-input>

            <q-input
              dense
              outlined
              :value="studentInformationForm.firstname"
              @input="setFirstname($event)"
              label="Firstname"
              class="text-capitalize"
              :error="validations.firstname.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.firstname.required"
              >
                Firstname is required
              </template>
            </q-input>
            <q-input
              dense
              outlined
              :value="studentInformationForm.middlename"
              @input="$emit('update:middlename', $event)"
              label="Middlename"
              class="text-capitalize"
              :error="false"
              hide-bottom-space
            />
            <q-input
              dense
              outlined
              type="text"
              :value="studentInformationForm.surname"
              @input="setSurname($event)"
              label="Surname"
              class="text-capitalize"
              :error="validations.surname.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.surname.required"
              >
                Surname is required
              </template>
            </q-input>

            <q-input
              dense
              outlined
              :value="studentInformationForm.suffix"
              @input="setSuffix($event)"
              label="Suffix"
              class="text-capitalize"
              hide-bottom-space
            >
            </q-input>

          </div>

          <div class="q-pt-xs-md q-pt-md-none col-md-4 col-xs-12 q-gutter-y-sm q-pl-md-lg">
            <q-input
              outlined
              dense
              :value="studentInformationForm.idnumber"
              @change="setIdnumber($event.target.value)"
              label="Id number"
              ref="refIdnumber"
              class="col-10"
              mask="#### - ####"
              hide-bottom-space
              :error="validations.idnumber.$error"
            >
              <template
                v-slot:error
                v-if="!validations.idnumber.required"
              >
                Id number is required
              </template>
              <template
                v-slot:error
                v-else-if="!validations.idnumber.minLength"
              >
                Please enter a valid Id number
              </template>
              <template
                v-slot:error
                v-else-if="!validations.idnumber.isUnique"
              >
                ID already registered
              </template>
            </q-input>

            <q-select
              dense
              outlined
              :value="studentInformationForm.course"
              @input="$emit('update:course', $event)"
              :options="options"
              label="Department"
              class="text-capitalize"
              :error="validations.course.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.course.required"
              >
                Personnel Department is required
              </template>
            </q-select>

            <q-input
              dense
              outlined
              type="text"
              :value="studentInformationForm.position"
              @input="setPosition($event)"
              label="Position"
              class="text-capitalize"
              :error="validations.position.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.position.required"
              >
                Personnel Position is Required
              </template>
            </q-input>

            <q-input
              dense
              outlined
              type="text"
              :value="studentInformationForm.contactNumber"
              @input="setContactNumber($event)"
              label="Contact Number"
              class="text-capitalize"
              mask="+639##-####-###"
              :error="validations.contactNumber.$error"
              hide-bottom-space
            >
              <template
                v-slot:error
                v-if="!validations.contactNumber.required"
              >
                Contact Number is Required
              </template>
            </q-input>

            <slot name="dialogBtn"></slot>
          </div>

        </div>

        <!-- </q-form> -->

      </div>
    </q-card-section>
    <!-- <pre>{{this.studentInformationForm}}</pre> -->
    <q-inner-loading :showing="loading">
      <q-spinner-gears
        size="50px"
        color="primary"
      />
    </q-inner-loading>
  </q-card>
</template>

<script>

export default {
  props: [
    'studentInformationForm',
    'options',
    'loading',
    'validations'
  ],
  data () {
    return {

    }
  },
  created () {
  },
  methods: {
    test () {
      console.log('test')
    },
    setPosition (event) {
      this.$emit('update:position', event)
      this.validations.position.$touch()
    },
    setFirstname (event) {
      this.$emit('update:firstname', event)
      this.validations.firstname.$touch()
    },
    setPrefix (event) {
      this.$emit('update:prefix', event)
      this.validations.prefix.$touch()
    },
    setSuffix (event) {
      this.$emit('update:suffix', event)
    },
    setSurname (event) {
      this.$emit('update:surname', event)
      this.validations.surname.$touch()
    },
    setIdnumber (event) {
      console.log(this.validations.idnumber.required)
      this.$emit('update:idnumber', event)
      this.validations.idnumber.$touch()
    },
    setContactNumber (event) {
      this.$emit('update:contactNumber', event)
      this.validations.contactNumber.$touch()
    }
  }
}
</script>

<style>
.scroll,
.scroll-x,
.scroll-y .uploaderBug {
  overflow: hidden;
}
</style>
