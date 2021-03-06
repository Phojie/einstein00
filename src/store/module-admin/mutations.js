import Vue from 'vue'
// import { date } from 'quasar'

// import { fireDB } from 'boot/firebase'
// import forEach from 'lodash/forEach'
// import find from 'lodash/find'

export function commitGetStudentLists (state, payload) {
  Vue.set(state.studentLists, payload.id, payload.information)
}

export function commitDeleteStudentLists (state, payload) {
  Vue.delete(state.studentLists, payload.keyIndex)
}

export function commitLoading (state, payload) {
  state.loading = payload
}

export function commitLoadingProgress (state, payload) {
  state.loadingProgress = payload
}

export function commitGetLibraryStat (state, payload) {
  Vue.set(state.libraryStat, payload.createdIndex, payload)
}

export function commitDeleteLibraryStat (state, payload) {
  console.log(payload)
  // var deleteId = find(state.libraryStat, ['keyData.keyIndex', payload])
  // console.log(deleteId.__index, 'delete id')
  Vue.delete(state.libraryStat, payload)
}

export function voteResult (state, payload) {
  if (payload === '1') {
    state.votesResult.entry1 += 1
    console.log(state.votesResult.entry1)
  } else if (payload === '2') {
    state.votesResult.entry2 += 1
    console.log(state.votesResult.entry2)
  } else if (payload === '3') {
    state.votesResult.entry3 += 1
    console.log(state.votesResult.entry3)
  }
}

export function commitGetPersonnelLists (state, payload) {
  Vue.set(state.personnelLists, payload.id, payload.information)
}

export function commitDeletePersonnelLists (state, payload) {
  Vue.delete(state.personnelLists, payload.keyIndex)
}

// registrar

export function commitSubjectDialog (state, payload) {
  state.subjectDialog = payload
}

export function commitGetSubjectsSchedule (state, payload) {
  Vue.set(state.subjectsSchedule, payload.keyIndex, payload)
}

export function commitDeleteSubjectsSchedule (state, payload) {
  Vue.delete(state.subjectsSchedule, payload.keyIndex)
}

export function commitGetSchoolYear (state, payload) {
  Vue.set(state.allSubjects, payload.keyIndex, payload)
}

export function commitDeleteSy (state, payload) {
  Vue.delete(state.allSubjects, payload.keyIndex)
}

export function commitAllCatalogG (state, payload) {
  Vue.set(state.listofCatalog, payload.keyIndex, payload)
  // state.listofCatalog[payload.keyIndex] = payload
}

export function commitDeleteCatalog (state, payload) {
  Vue.delete(state.listofCatalog, payload.keyIndex)
}
