import React from 'react';
import WikiWidgetViewModel from 'wiki/WikiWidgetViewModel';

const CSS = {
  base: "esri-wikipedia",
  icon: "esri-icon socicon-wikipedia",

  panel: "esri-wikipedia__panel",
  panelOpen: "esri-wikipedia__panel--open",
  loading: "esri-wikipedia__panel--loading",
  title: "esri-wikipedia__title",
  refresh: "esri-wikipedia__refresh",
  refreshIcon: "esri-icon-refresh",
  close: "esri-wikipedia__close esri-icon-close",
  scroller: "esri-wikipedia__list-scroller",

  list: "esri-wikipedia__list",
  message: "esri-wikipedia__message",
  item: "esri-wikipedia__result",
  image: "esri-wikipedia__result-image",
  noImage: "esri-wikipedia__result-image--none",
  noImageIcon: "esri-wikipedia--deny-icon esri-icon-deny",
  header: "esri-wikipedia__header",
  footer: "esri-wikipedia__footer"
};

const WikiWidget = React.createClass({

  getInitialState() {
    return {
      vm: new WikiWidgetViewModel(),
      results: [],
      updating: false
    };
  },

  getDefaultProps() {
    return {
      view: {}
    };
  },

  componentDidMount() {
    this.props.view.then(view => {
      this.state.vm.view = view;

      this.refresh();
    });
  },

  refresh() {
    this._showLoadingStatus();

    this.state.vm.getNearbyItems()
      .then(this._updateResults)
      .always(this._hideLoadingStatus);
  },

  _showLoadingStatus: function() {
    this.setState({
      updating: true
    });
  },

  _updateResults: function(results) {
    this.setState({
      results: results
    });
  },

  _hideLoadingStatus: function() {
    this.setState({
      updating: false
    });
  },

  _generateListItems: function() {
    let isLoading = this.state.updating;
    let noResults = this.state.results.length === 0;
    let items;

    if (isLoading) {
      items = (
        <li className={CSS.message} key={0}>
          {"Fetching results..."}
        </li>
      );
    }
    // todo: sync properly
    //else if (noResults) {
    //  items = (
    //    <li className={CSS.message}>
    //      {"No results"}
    //    </li>
    //  );
    //}
    else {
      items = this.state.results.map(function(item, index) {
        let styles = {};
        let imageClass = CSS.image;
        let attribs = item.attributes;

        if (attribs.image) {
          styles.backgroundImage = "url('" + attribs.image + "')";
        }
        else {
          imageClass += " " + CSS.icon;
        }

        return (
          <li className={CSS.item} data-id={attribs.id} tabIndex={0}
              onClick={this._highlightItem.bind(this, attribs.id)} key={index}>
            <span className={imageClass} title={attribs.title}
                  style={styles}></span>
            <span>{attribs.title}</span>
          </li>
        )
      }, this);
    }

    return items;
  },

  _highlightItem: function(index) {
    this.state.vm.highlight(index);
  },

  render() {
    let panelClasses = this.state.updating ?
                       CSS.panel + " " + CSS.loading :
                       CSS.panel;

    return (
      <div className={panelClasses}>
        <div className={CSS.header}>
          <h1 className={CSS.title}>{"Wikipedia"}</h1>
        </div>
        <div className={CSS.scroller}>
          <ol className={CSS.list}>
            {this._generateListItems()}
          </ol>
        </div>
        <div className={CSS.footer}>
          <div className={CSS.refresh} title={"Refresh"} tabIndex={0}
               onClick={this.refresh}>
            <span className={CSS.refreshIcon}></span>
            {"Refresh"}
          </div>
        </div>
      </div>
    );

  }
});

export default WikiWidget;
