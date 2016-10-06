var Post = React.createClass({
  propTypes: {
    body: React.PropTypes.string,
    user: React.PropTypes.object,
    reply_to_user: React.PropTypes.object,
    user_id: React.PropTypes.string,
    updated_at: React.PropTypes.string,
    reply_post_id: React.PropTypes.string
  },
  getInitialState: function () {
    return ({
      showResponse: false,
      posted: false
    })
  },

  _setPosted: function (_state) {
    this.setState({posted: _state})
  },
  _hideResponse: function () {
    this.setState({showResponse: false})
  },
  _hidePost: function () {
    $('#post_' + this.props.post.id).hide();
  },
  _showResponse: function () {
    this.setState({showResponse: true})
  },
  _deletePost: function () {
    var self = this;
    if (!confirm('are you sure you want to delete ' + this.props.post.id + '?')) {
      return false;
    }
    $.ajax({
      url: '/posts/' + self.props.post.id + '.json',
      method: 'delete',
      success: function () {
        self._hidePost();
      }, error: function (xhr, status, error) {
        $.snackbar({content: error, style: "error", htmlAllowed: true, timeout: 2000});
      }
    });
  },
  render: function () {
    return (
        <div className="row">
          <div id={'post_' + this.props.post.id} className="card">
            <div className="card-content">
              <div className="card-title grey-text text-darken-4 valign">
                <PostOptions handleDelete={this._deletePost} handleReply={this._showResponse} canDelete={gon.current_user.username == this.props.post.username}/>
                <a href={"/users/" + this.props.post.user_id}>@{this.props.post.username}</a>
                <Checkmark display={this.state.posted}/>
              </div>
              <h6 className="small">
                {this.props.post.updated_at}
              </h6>
              <p className="card-text">
                {this.props.post.body}
              </p>
            </div>
          </div>
          {this.state.showResponse ?
              <PostResponse post={this.props.post}
                            hideMe={this._hideResponse}
                            setPosted={this._setPosted}
                            callback={this.props.callback}/>
              : null
          }
        </div>
    )
  }
});