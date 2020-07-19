import axios from 'axios'
import { DateTime } from 'luxon';

const token = process.env.SLACK_API_TOKEN

const getUser = (user) => {
  return axios.get('https://slack.com/api/users.info', { params: { token, user } })
    .then(({ data }) => data.user)
    .catch(error => {
      console.log(error)
    })
}

const calcTimeLeft = (timezone) => {
  const now = DateTime.local().setZone(timezone)
  const [start, end] = [8, 17]

  let daysLeft = (7 - (now.weekday - 5)) % 7
  if (daysLeft === 0 && now.hours >= end) daysLeft = 7

  const nextFriday = now.plus({ days: daysLeft }).set({ hour: start, minute: 0, second: 0 })
  const pastryTime = (nextFriday.toMillis() - now.toMillis()) < 1000
  const diff = nextFriday.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject()

  return { pastryTime, ...diff }
}

export default (req, res) => {
  getUser(req.body.user_id).then(user => {
    let text

    const { pastryTime, days, hours, minutes, seconds } = calcTimeLeft(user.tz)

    if (pastryTime) {
      text = '🥐🎉🥐🎉🥐🎉🥐🎉🥐🥐🎉🥐🎉🥐🎉🥐🎉🥐🥐🎉🥐🎉🥐🎉🥐🎉🥐🥐🎉🥐🎉🥐🎉🥐🎉🥐🥐🎉🥐🎉🥐🎉🥐🎉🥐🥐🎉🥐🎉🥐🎉🥐🎉🥐'
    } else {
      text = `Hey <@${user.id}>! Get ready for your 🥐🥐🥐 in:`
      text += ` ⏱️ ${days} day${days === 1 ? '' : 's'}`
      text += ` ⏱️ ${hours} hour${hours === 1 ? '' : 's'}`
      text += ` ⏱️ ${minutes} minute${minutes === 1 ? '' : 's'}`
      text += ` ⏱️ ${seconds} second${seconds === 1 ? '' : 's'}`
    }

    res.json({ text: text.trim() })
  })
}
