class UserMention
  include Elasticsearch::Persistence::Model
  include ElasticsearchSearchable

  #
  # Created by (username)
  #
  attribute :username, String, mapping: {fields: {
    username: {type: 'string'},
    raw:      {type: 'string', analyzer: 'keyword'}
  }}
  attribute :message_id, String, mapping: {fields: {
    message_id: {type: 'string'}
  }}

  def self.find_by_username(_username)
    _username = _username.start_with?("@") ? _username : "@#{_username}"
    search(
      query: {
        match: {username: _username}
      },
      sort:  [{
                created_at: {order: 'desc'}
              }]
    )
  end

  def initialize(options = {})
    @id = self.id || SecureRandom.uuid
    super(options)
  end

  # Has Many messages
  def messages
    Message.search(
      query: {
        bool: {
          should: [{match: {body: "@#{username} "}}]
        }
      },
      sort:  [{
                created_at: {order: 'desc'}
              }]
    )
  end


end