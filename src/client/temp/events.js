/* returns list of evnets, this is temporarely till we get a server setup */

import rawMtbEventsFromSpreadsheet from 'client/temp/data/2016-mtb'
import rawMtbEventsManual from 'client/temp/data/2016-mtb-manual'

import rawNcnca2016Events from 'client/temp/data/2016-ncnca-events'
import rawNcnca2017Events from 'client/temp/data/2017-ncnca-events'

import fetchRawNcncaDraftEvents2017 from 'client/temp/fetch-ncnca-draft-events-2017'
import moment from 'moment'
import { hash } from 'client/utils/math'

const preProcessUrl = (rawUrl) => {
  if (rawUrl) {
    if (rawUrl.startsWith('http') || rawUrl.startsWith('https')) {
      return rawUrl
    } else {
      return 'http://' + rawUrl
    }
  } else {
    return ''
  }
}

const createEvent = rawEvent => {
  const name = rawEvent.name.replace(/--/g, '—')
  const date = moment(rawEvent.date, 'MMMM DD YYYY')
  const datePlain = date.format('MMDDYYYY')

  //TODO bc: revisit this, add ids?,
  const eventId = (rawEvent.id && rawEvent.id.startsWith('evt-'))
    ? rawEvent.id
    : 'evt-' + hash(name) + '-' + datePlain

  return {
    id: eventId,
    name: name,
    date: date,
    datePlain: datePlain,
    type: rawEvent.type,
    discipline: rawEvent.discipline,
    usacPermit: rawEvent.usacPermit || undefined,
    //TODO: add location name
    location: rawEvent.location || {},
    flyerUrl: preProcessUrl(rawEvent.flyerUrl),
    flyer: rawEvent.flyer,
    status: rawEvent.status || undefined, //getting rid of empty strings
    group: rawEvent.group, //group of event according to NCNCA planning document
    draftNotes: rawEvent.draftNotes,
    isDraft: (rawEvent.isDraft || false),
    promoters: rawEvent.promoters || [],
    promoterInfo: rawEvent.promoterInfo,
    series: rawEvent.series,
    websiteUrl: preProcessUrl(rawEvent.websiteUrl),
    registrationUrl: preProcessUrl(rawEvent.registrationUrl)
  }
}

const preProcessEvents = rawEvents =>
  rawEvents.map(rawEvent => createEvent(rawEvent))
const rawMtbEvents = rawMtbEventsFromSpreadsheet.concat(rawMtbEventsManual)
const norcalMtb2016Events = preProcessEvents(rawMtbEvents)
const ncnca2016Events = preProcessEvents(rawNcnca2016Events)
const fetchNcncaDraftEvents2017 = () => fetchRawNcncaDraftEvents2017()
  .then(eventsRaw => preProcessEvents(eventsRaw))

const ncnca2017Events = preProcessEvents(rawNcnca2017Events)

export {
  norcalMtb2016Events,
  ncnca2016Events,
  fetchNcncaDraftEvents2017,
  ncnca2017Events
}
