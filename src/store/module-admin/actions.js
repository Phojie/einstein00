import { fireStorage, fireDB } from 'boot/firebase'
import Vue from 'vue'
import capitalize from 'lodash/capitalize'
import forEach from 'lodash/forEach'
import filter from 'lodash/filter'
// import lowerFirst from 'lodash/lowerFirst'

export function getStudentLists ({ commit, state }) {
  return new Promise((resolve, reject) => {
    if (state.studentLists.__ob__.vmCount === 0) {
      fireDB
        .collection('studentLists')
        .onSnapshot(function (snapshot) {
          snapshot.docChanges().forEach(
            function (change) {
              if (change.type === 'added' || change.type === 'modified') {
              // console.log(change.doc.data())
                const data = {
                  id: change.doc.data().keyIndex,
                  information: change.doc.data()
                }
                const fullname = `${change.doc.data().firstname} ${change.doc.data().middlename.charAt(0)}. ${change.doc.data().surname}`

                Vue.set(data.information, 'fullname', fullname)
                commit('commitGetStudentLists', data)
              }
              if (change.type === 'modified') {
              }
              if (change.type === 'removed') {
              // console.log('Removed city: ', change.doc.data())
                commit('commitDeleteStudentLists', change.doc.data())
              }
              resolve()
            },
            function (error) {
            // The Promise was rejected.
              reject()
              console.error(error)
            }
          )
        })
    } else {
      resolve()
    }
  })
}

export function addStudentLists (context, payload) {
  let docRef = fireDB.collection('studentLists').doc()
  const myid = docRef.id
  var defaultUrl = '/statics/default_profile_400x400.png'
  var addStudent = new Promise(function (resolve, reject) {
    if (payload.profileImgUrl !== '') {
      var uploadTask = fireStorage
        .ref()
        .child('images/' + myid)
        .putString(payload.profileImgUrl, 'data_url')
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit('commitLoading', false)
          } else {
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload)

          resolve()
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            docRef.set({
              firstname: capitalize(payload.firstname),
              middlename: capitalize(payload.middlename),
              surname: capitalize(payload.surname),
              idnumber: capitalize(payload.idnumber),
              LRNnumber: capitalize(payload.LRNnumber),
              keyIndex: myid,
              profileImgUrl: downloadURL,
              course: capitalize(payload.course)
            })
            resolve()
          })
        }
      )
    } else {
      docRef.set({
        firstname: capitalize(payload.firstname),
        middlename: capitalize(payload.middlename),
        surname: capitalize(payload.surname),
        idnumber: capitalize(payload.idnumber),
        keyIndex: myid,
        profileImgUrl: defaultUrl,
        course: capitalize(payload.course)
      })
      resolve()
    }
  })

  var promiseProgress = new Promise(function (resolve, reject) {
    // enter logic here
  })

  return Promise.race([addStudent, promiseProgress])
}

export function deleteStudentLists (context, payload) {
  var deleteImg = new Promise((resolve, reject) => {
    var imgRef = fireStorage.ref().child('images/' + payload.keyIndex)
    imgRef
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        reject(error)
      })
  })
  var deleteList = new Promise((resolve, reject) => {
    fireDB
      .collection('studentLists')
      .doc(payload.keyIndex)
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        reject(error)
      })
  })

  return Promise.all([deleteImg, deleteList])
}

export function updateStudentLists (context, payload) {
  return new Promise(function (resolve, reject) {
    var progressBoolean = Boolean
    let docRef = fireDB
      .collection('studentLists')
      .doc(payload.studentInfo.keyIndex)
    if (payload.uploaded) {
      var reupload = fireStorage
        .ref()
        .child('images/' + payload.studentInfo.keyIndex)
        .putString(payload.studentInfo.profileImgUrl, 'data_url')
      reupload.on(
        'state_changed',
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            progressBoolean = false
            // context.commit('commitLoading', false)
          } else {
            progressBoolean = true
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload.studentInfo)
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          reupload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            var dataUpdated = {
              firstname: capitalize(payload.studentInfo.firstname),
              middlename: capitalize(payload.studentInfo.middlename),
              surname: capitalize(payload.studentInfo.surname),
              idnumber: capitalize(payload.studentInfo.idnumber),
              profileImgUrl: downloadURL,
              course: capitalize(payload.studentInfo.course),
              keyIndex: payload.studentInfo.keyIndex
            }
            docRef.update(dataUpdated).then(function () {
              resolve(dataUpdated)
              context.commit('commitLoading', progressBoolean)
            })
          })
        }
      )
    } else {
      docRef.update({
        firstname: capitalize(payload.studentInfo.firstname),
        middlename: capitalize(payload.studentInfo.middlename),
        surname: capitalize(payload.studentInfo.surname),
        idnumber: capitalize(payload.studentInfo.idnumber),
        profileImgUrl: payload.studentInfo.profileImgUrl,
        course: capitalize(payload.studentInfo.course)
      })
      resolve(payload.studentInfo)
    }
  })
}

export function addLibraryStat (context, payload) {
  return new Promise((resolve, reject) => {
    let docRef = fireDB
      .collection('Library/uyM3J8XUI1aI4dDm0reC/Statisticshay')
      .doc()
    // let docRef = LibraryDB.collection('Statistics').doc('test').doc()
    let myId = docRef.id
    docRef.set(
      {
        idnumber: payload.idnumber,
        keyIndex: myId,
        created: payload.time
      },
      function (error) {
        reject(error)
      }
    )
    resolve()
  })
}

export function libraryStatData ({ commit, state }, payload) {
  var myData = state.studentLists[payload.information.idnumber]
  var data = {
    createdIndex: payload.information.keyIndex,
    date: payload.information.created.date,
    local: payload.information.created.local,
    time: payload.information.created.time,
    course: myData.course,
    firstname: myData.firstname,
    idnumber: myData.idnumber,
    keyIndex: myData.keyIndex,
    middlename: myData.middlename,
    profileImgUrl: myData.profileImgUrl,
    surname: myData.surname,
    fullname: myData.fullname,
    numberVisit: 1
  }
  commit('commitGetLibraryStat', data)
}

export function getLibraryStat ({ commit, dispatch, state }, payload) {
  return new Promise(function (resolve, reject) {
    // fireDB.collection('studentLists').onSnapshot({ includeMetadataChanges: true }, function (snapshot) {
    if (state.personnelLists.__ob__.vmCount === 0) {
      fireDB
        .collection('Library/uyM3J8XUI1aI4dDm0reC/Statisticshay')
        .onSnapshot(function (snapshot) {
          snapshot.docChanges().forEach(
            function (change) {
              if (change.type === 'added' || change.type === 'modified') {
              // console.log(change.doc.data())
                if (change.doc.data().keyIndex) {
                  const data = {
                    id: change.doc.data().keyIndex,
                    information: change.doc.data()
                  }
                  dispatch('libraryStatData', data)
                }
              }
              if (change.type === 'modified') {
                console.log('modified console')
              }
              if (change.type === 'removed') {
                commit(
                  'commitDeleteLibraryStat',
                  change.doc.data().keyIndex
                )
              // console.log('Removed city: ', change.doc.data())
              // context.commit('commitDeleteStudentLists', change.doc.data())
              }
            },
            function (error) {
            // The Promise was rejected.
              reject()
              console.error(error)
            }
          )
        })
    } else {
      resolve()
    }
  })
}

export function deleteStatistics (context, payload) {
  console.log(payload)
  return new Promise((resolve, reject) => {
    fireDB
      .collection('Library/uyM3J8XUI1aI4dDm0reC/Statisticshay')
      .doc(payload.createdIndex)
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

export function addPersonnelLists (context, payload) {
  console.log(payload)
  let docRef = fireDB
    .collection('Registrar/Personnel/Lists')
    .doc()
  const myid = docRef.id
  var defaultUrl = '/statics/default_profile_400x400.png'
  var addStudent = new Promise(function (resolve, reject) {
    if (payload.profileImgUrl !== '') {
      var uploadTask = fireStorage
        .ref()
        .child('1.PersonnelListsImages/' + myid + 'file/' + myid)
        .putString(payload.profileImgUrl, 'data_url')
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit('commitLoading', false)
          } else {
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload)

          resolve()
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            docRef.set({
              firstname: capitalize(payload.firstname),
              middlename: capitalize(payload.middlename),
              surname: capitalize(payload.surname),
              idnumber: capitalize(payload.idnumber),
              prefix: capitalize(payload.prefix),
              suffix: capitalize(payload.suffix),
              position: capitalize(payload.position),
              keyIndex: myid,
              contactNumber: payload.contactNumber,
              profileImgUrl: downloadURL,
              department: capitalize(payload.course)
            })
            resolve()
          })
        }
      )
    } else {
      docRef.set({
        firstname: capitalize(payload.firstname),
        middlename: capitalize(payload.middlename),
        surname: capitalize(payload.surname),
        idnumber: capitalize(payload.idnumber),
        prefix: capitalize(payload.prefix),
        position: capitalize(payload.position),
        suffix: capitalize(payload.suffix),
        keyIndex: myid,
        profileImgUrl: defaultUrl,
        department: capitalize(payload.course)
      })
      resolve()
    }
  })

  var promiseProgress = new Promise(function (resolve, reject) {
    // enter logic here
  })

  return Promise.race([addStudent, promiseProgress])
}

export function getPersonnelLists (context) {
  return new Promise((resolve, reject) => {
    fireDB
      .collection('Registrar/Personnel/Lists')
      .onSnapshot(function (snapshot) {
        resolve()
        snapshot.docChanges().forEach(
          function (change) {
            if (change.type === 'added' || change.type === 'modified') {
              // console.log(change.doc.data())
              const data = {
                id: change.doc.data().keyIndex,
                information: change.doc.data()
              }

              const fullname = `${
                change.doc.data().firstname} ${change.doc.data().middlename.charAt(0)}. ${change.doc.data().surname}`

              Vue.set(data.information, 'fullname', fullname)
              context.commit('commitGetPersonnelLists', data)
            }
            if (change.type === 'modified') {
            }
            if (change.type === 'removed') {
              // console.log('Removed city: ', change.doc.data())
              context.commit('commitDeletePersonnelLists', change.doc.data())
            }
          },
          function (error) {
            // The Promise was rejected.
            reject()
            console.error(error)
          }
        )
      })
  })
}

export function deletePersonnelLists (context, payload) {
  var deleteImg = new Promise((resolve, reject) => {
    var imgRef = fireStorage.ref().child('1.PersonnelListsImages/' + payload.keyIndex + 'file/' + payload.keyIndex)
    imgRef
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        reject(error)
      })
  })
  var deleteList = new Promise((resolve, reject) => {
    fireDB
      .collection('Registrar/Personnel/Lists')
      .doc(payload.keyIndex)
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        reject(error)
      })
  })

  return Promise.all([deleteImg, deleteList])
}

export function updatePersonnelLists (context, payload) {
  // course === department
  return new Promise(function (resolve, reject) {
    var progressBoolean = Boolean
    let docRef = fireDB
      .collection('Registrar/Personnel/Lists')
      .doc(payload.studentInfo.keyIndex)
    if (payload.uploaded) {
      var reupload = fireStorage
        .ref()
        .child('1.PersonnelListsImages/' + payload.studentInfo.keyIndex + 'file/' + payload.studentInfo.keyIndex)
        .putString(payload.studentInfo.profileImgUrl, 'data_url')
      reupload.on(
        'state_changed',
        function (snapshot) {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            progressBoolean = false
            // context.commit('commitLoading', false)
          } else {
            progressBoolean = true
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload.studentInfo)
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          reupload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            var dataUpdated = {
              firstname: capitalize(payload.studentInfo.firstname),
              middlename: capitalize(payload.studentInfo.middlename),
              surname: capitalize(payload.studentInfo.surname),
              prefix: capitalize(payload.studentInfo.prefix),
              suffix: capitalize(payload.studentInfo.suffix),
              position: capitalize(payload.studentInfo.position),
              department: capitalize(payload.studentInfo.course),
              idnumber: capitalize(payload.studentInfo.idnumber),
              profileImgUrl: downloadURL,
              course: capitalize(payload.studentInfo.course),
              keyIndex: payload.studentInfo.keyIndex
            }
            docRef.update(dataUpdated).then(function () {
              resolve(dataUpdated)
              context.commit('commitLoading', progressBoolean)
            })
          })
        }
      )
    } else {
      docRef.update({
        firstname: capitalize(payload.studentInfo.firstname),
        middlename: capitalize(payload.studentInfo.middlename),
        surname: capitalize(payload.studentInfo.surname),
        idnumber: capitalize(payload.studentInfo.idnumber),
        prefix: capitalize(payload.studentInfo.prefix),
        suffix: capitalize(payload.studentInfo.suffix),
        position: capitalize(payload.studentInfo.position),
        department: capitalize(payload.studentInfo.course),
        profileImgUrl: payload.studentInfo.profileImgUrl,
        course: capitalize(payload.studentInfo.course)
      })
      resolve(payload.studentInfo)
    }
  })
}
// registrar GOD WE TRUST :)

export function addSubjectSchedule (state, payload) {
  return new Promise((resolve, reject) => {
    let docRef = fireDB
      .collection('VPAA/subjectSchedules/Lists/')
      .doc()
    let myId = docRef.id
    docRef.set(
      {
        keyIndex: myId,
        schoolYear: payload.schoolYear,
        semester: payload.semester,
        courseCode: payload.courseCode,
        descriptiveTitle: capitalize(payload.descriptiveTitle),
        units: payload.units,
        day: capitalize(payload.day),
        timeFrom: payload.timeFrom,
        timeTo: payload.timeTo,
        room: capitalize(payload.room),
        instructorKeyIndex: payload.instructor.keyIndex
      },
      function (error) {
        reject(error)
      }
    )
    resolve(payload)
  })
}

export function getSubjectSchedule (context, payload) {
  return new Promise((resolve, reject) => {
    fireDB
      .collection('VPAA/subjectSchedules/Lists/')
      .where('schoolYear', '==', payload.year)
      .where('semester', '==', payload.semester)
      .onSnapshot(function (snapshot) {
        resolve()
        snapshot.docChanges().forEach(
          function (change) {
            if (change.type === 'added' || change.type === 'modified') {
              // console.log(change.doc.data())
              context.commit('commitGetSubjectsSchedule', change.doc.data())
            }
            if (change.type === 'modified') {
            }
            if (change.type === 'removed') {
              // console.log('Removed city: ', change.doc.data())
              context.commit('commitDeleteSubjectsSchedule', change.doc.data())
            }
          },
          function (error) {
            // The Promise was rejected.
            reject()
            console.error(error)
          }
        )
        resolve()
      })
  })
}

export function getSchoolYear (context, payload) {
  return new Promise((resolve, reject) => {
    fireDB
      .collection('VPAA/subjectSchedules/Lists/')
      .onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(
          function (change) {
            if (change.type === 'added' || change.type === 'modified') {
              context.commit('commitGetSchoolYear', change.doc.data())
            }
            if (change.type === 'modified') {
            }
            if (change.type === 'removed') {
              // console.log('Removed city: ', change.doc.data())
              context.commit('commitDeleteSy', change.doc.data())
            }
          },
          function (error) {
            // The Promise was rejected.
            reject()
            console.error(error)
          }
        )
        resolve()
      })
  })
}

// Library IN GOD WE TRUST :()

export function addCatalogAction (context, payload) {
  let docRef = fireDB.collection('Library/fIrWnYeJhM1fgkoj14gr/Catalogs').doc()
  const myid = docRef.id
  var defaultUrl = '/statics/default_profile_400x400.png'
  var addStudent = new Promise(function (resolve, reject) {
    if (payload.imgUrl === null || payload.imgUrl === '' || payload.url === undefined) {
      docRef.set({
        accessionNumber: payload.accessionNumber,
        title: capitalize(payload.title),
        author: capitalize(payload.author),
        type: capitalize(payload.type),
        callNumber: capitalize(payload.callNumber),
        sublocation: capitalize(payload.sublocation),
        isbn: capitalize(payload.isbn),
        editedBy: capitalize(payload.editedBy),
        published: capitalize(payload.published),
        copyright: capitalize(payload.copyright),
        format: capitalize(payload.format),
        contentTypeTerm: capitalize(payload.contentTypeTerm),
        carrierTypeTerm: capitalize(payload.carrierTypeTerm),
        keyIndex: myid,
        imgUrl: defaultUrl,
        additionalInfo: payload.additionalInfo

      })
      resolve()
    } else {
      var uploadTask = fireStorage
        .ref()
        .child('Library/CatalogImages/' + myid)
        .putString(payload.imgUrl, 'data_url')
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit('commitLoading', false)
          } else {
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload)

          resolve()
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            docRef.set({
              accessionNumber: payload.accessionNumber,
              title: capitalize(payload.title),
              author: capitalize(payload.author),
              type: capitalize(payload.type),
              callNumber: capitalize(payload.callNumber),
              sublocation: capitalize(payload.sublocation),
              isbn: capitalize(payload.isbn),
              editedBy: capitalize(payload.editedBy),
              published: capitalize(payload.published),
              copyright: capitalize(payload.copyright),
              format: capitalize(payload.format),
              contentTypeTerm: capitalize(payload.contentTypeTerm),
              carrierTypeTerm: capitalize(payload.carrierTypeTerm),
              keyIndex: myid,
              imgUrl: downloadURL,
              additionalInfo: payload.additionalInfo
            })
            resolve()
          })
        }
      )
    }
  })

  var promiseProgress = new Promise(function (resolve, reject) {
    // enter logic here
  })

  return Promise.race([addStudent, promiseProgress])
}

export function getAllCatalogAction (context) {
  return new Promise((resolve, reject) => {
    fireDB
      .collection('Library/fIrWnYeJhM1fgkoj14gr/Catalogs')
      .onSnapshot(function (snapshot) {
        resolve()
        snapshot.docChanges().forEach(
          function (change) {
            if (change.type === 'added' || change.type === 'modified') {
              // console.log(change.doc.data())
              context.commit('commitAllCatalogG', change.doc.data())
            }
            if (change.type === 'modified') {
            }
            if (change.type === 'removed') {
              // console.log('Removed city: ', change.doc.data())
              context.commit('commitDeleteCatalog', change.doc.data())
            }
          },
          function (error) {
            // The Promise was rejected.
            reject()
            console.error(error)
          }
        )
      })
  })
}
export function updateCatalogAction (context, data) {
  let payload = data.data
  console.log(data, payload.keyIndex)
  let dummypayload = data.dummyData
  let docRef = fireDB.collection('Library/fIrWnYeJhM1fgkoj14gr/Catalogs').doc(payload.keyIndex)
  var defaultUrl = '/statics/default_profile_400x400.png'
  var addStudent = new Promise(function (resolve, reject) {
    if (payload.imgUrl === null || payload.imgUrl === '') {
      console.log('1')
      docRef.update({
        accessionNumber: payload.accessionNumber,
        title: capitalize(payload.title),
        author: capitalize(payload.author),
        type: capitalize(payload.type),
        callNumber: capitalize(payload.callNumber),
        sublocation: capitalize(payload.sublocation),
        isbn: capitalize(payload.isbn),
        editedBy: capitalize(payload.editedBy),
        published: capitalize(payload.published),
        copyright: capitalize(payload.copyright),
        format: capitalize(payload.format),
        contentTypeTerm: capitalize(payload.contentTypeTerm),
        carrierTypeTerm: capitalize(payload.carrierTypeTerm),
        keyIndex: payload.keyIndex,
        imgUrl: defaultUrl,
        additionalInfo: payload.additionalInfo

      })
      resolve()
    } else if (payload.imgUrl === dummypayload.imgUrl) {
      console.log('2')
      docRef.update({
        accessionNumber: payload.accessionNumber,
        title: capitalize(payload.title),
        author: capitalize(payload.author),
        type: capitalize(payload.type),
        callNumber: capitalize(payload.callNumber),
        sublocation: capitalize(payload.sublocation),
        isbn: capitalize(payload.isbn),
        editedBy: capitalize(payload.editedBy),
        published: capitalize(payload.published),
        copyright: capitalize(payload.copyright),
        format: capitalize(payload.format),
        contentTypeTerm: capitalize(payload.contentTypeTerm),
        carrierTypeTerm: capitalize(payload.carrierTypeTerm),
        keyIndex: payload.keyIndex,
        imgUrl: payload.imgUrl,
        additionalInfo: payload.additionalInfo

      })
      resolve()
    } else {
      console.log('3')
      var uploadTask = fireStorage
        .ref()
        .child('Library/CatalogImages/' + payload.keyIndex)
        .putString(payload.imgUrl, 'data_url')
      uploadTask.on(
        'state_changed',
        function (snapshot) {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // console.log('Upload is ' + progress + '% done')
          if (progress === 100) {
            context.commit('commitLoading', false)
          } else {
            context.commit('commitLoading', true)
          }
          context.commit('commitLoadingProgress', payload)

          resolve()
        },
        function (error) {
          // Handle unsuccessful uploads
          console.log(error)
          reject()
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            docRef.update({
              accessionNumber: payload.accessionNumber,
              title: capitalize(payload.title),
              author: capitalize(payload.author),
              type: capitalize(payload.type),
              callNumber: capitalize(payload.callNumber),
              sublocation: capitalize(payload.sublocation),
              isbn: capitalize(payload.isbn),
              editedBy: capitalize(payload.editedBy),
              published: capitalize(payload.published),
              copyright: capitalize(payload.copyright),
              format: capitalize(payload.format),
              contentTypeTerm: capitalize(payload.contentTypeTerm),
              carrierTypeTerm: capitalize(payload.carrierTypeTerm),
              keyIndex: payload.keyIndex,
              imgUrl: downloadURL,
              additionalInfo: payload.additionalInfo
            })
            resolve()
          })
        }
      )
    }
  })

  var promiseProgress = new Promise(function (resolve, reject) {
    // enter logic here
  })

  return Promise.race([addStudent, promiseProgress])
}

export function SubjectDialogAction (context, data) {
  context.commit('commitSubjectDialog', data)
}

export function deleteCatalogAction (context, payload) {
  var deleteImg = new Promise((resolve, reject) => {
    var imgRef = fireStorage.ref().child('Library/CatalogImages/' + payload)
    imgRef
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        // Uh-oh, an error occurred!
        resolve(payload)
        console.log(error)
      })
  })
  var deleteList = new Promise((resolve, reject) => {
    fireDB
      .collection('Library/fIrWnYeJhM1fgkoj14gr/Catalogs')
      .doc(payload)
      .delete()
      .then(function () {
        resolve(payload)
      })
      .catch(function (error) {
        reject(error)
      })
  })

  return Promise.all([deleteImg, deleteList])
}

export function deleteSyAction ({ commit, state }, payload) {
  var deleteList = new Promise((resolve, reject) => {
    let dataSyfilt = filter(state.allSubjects, ['schoolYear', payload.schoolYear])
    forEach(dataSyfilt, function (value) {
      console.log(value)
      fireDB
        .collection('VPAA/subjectSchedules/Lists')
        .doc(value.keyIndex)
        .delete()
        .then(function () {
          resolve(value)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  })

  return deleteList
}
