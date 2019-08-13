require "net/http"
require "uri"

class Post < ApplicationRecord
  belongs_to :poster, class_name: 'User', foreign_key: :poster_id
  belongs_to :recipient, class_name: 'User', foreign_key: :recipient_id
  after_create :alarm_create, if: -> {alarm.present?}
  after_update :alarm_changes, if: -> {saved_change_to_alarm? || saved_change_to_body? || saved_change_to_date?}
  before_destroy :alarm_destroy, if: -> {alarm.present?}

  def alarm_create
    uri = URI("http://localhost:3008/api/reminders")
    req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    req.body = {
      "reminder":{
        "post_id": id,
        "alarm": alarm,
        "date": date,
        "body": body,
        "poster_name": poster.first_name + ' ' + poster.last_name,
        "endpoint": recipient.endpoint,
        "auth": recipient.auth,
        "p256dh": recipient.p256dh
      }
    }.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(req)
    end
  end

  def alarm_changes
    uri = URI("http://localhost:3008/api/reminders")
    req = Net::HTTP::Put.new(uri, 'Content-Type' => 'application/json')
    req.body = {
      "reminder":{
        "post_id": id,
        "alarm": alarm,
        "date": date,
        "body": body,
        "poster_name": poster.first_name + ' ' + poster.last_name,
        "endpoint": recipient.endpoint,
        "auth": recipient.auth,
        "p256dh": recipient.p256dh
      }
    }.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(req)
    end
  end

  def alarm_destroy
    uri = URI("http://localhost:3008/api/reminders")
    req = Net::HTTP::Delete.new(uri, 'Content-Type' => 'application/json')
    req.body = {
      "reminder":{
        "post_id": id
      }
    }.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(req)
    end
  end

end
