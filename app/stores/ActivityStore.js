'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _activities = [];
let _activitiesIdMap = {};

function _addSpeech(speech) {
    _activitiesIdMap[speech.id.toString()] = speech;
}

const md5 = require('blueimp-md5');
let SpeechStore = assign({}, BaseStore, {

    getSpeeches() {
        return _activities;
    },
    getSpeech(id) {
        if (_activitiesIdMap[id]) {
            return _activitiesIdMap[id];
        }
        return null;
    },
    nextSpeech(){
        let firstAfterComing = _activities.findIndex(a => new Date(a.time) < new Date());
        if (firstAfterComing == 0) {
            return null;
        } else if (firstAfterComing == -1) {
            return _activities[_activities.length - 1];
        }
        else {
            return _activities[firstAfterComing - 1];
        }
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        let changed = true;

        switch (payload.type) {
            case Constants.ActionTypes.ACTIVITIES_UPDATE:
                _activities = data;
                break;
            case Constants.ActionTypes.RECEIVE_ACTIVITY:
                _addSpeech(data);
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            SpeechStore.emitChange();
        }
    })

});

module.exports = SpeechStore;
