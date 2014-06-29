fuel = (function($) {
  var
    maxGallons, currentPanel, targetPanel, $currentContainer, $targetContainer,
    $actionContainer, $actionGallons, $actionPanel, $actionTitle,
    makeLoadPanel, renderAction, doAction, onFocus, onBlur, onClickAction,
    format, initModule;

  format = function(num) {
    return new Number(num).toPrecision(3);
  };

  makeLoadPanel = function($container, name, default_value) {
    var clamp, proto, panel;

    clamp = function(a, min, max) {
      return Math.min(max, Math.max(min, a));
    };

    proto = {
      loadOrElseDefault: function() {
        var stored_val = localStorage.getItem(this.name);
        this.value = stored_val === null ? default_value : parseInt(stored_val);
      },

      save: function() {
        localStorage[this.name] = this.value;
      },

      render: function() {
        var
          gallons = 0.01 * this.value * maxGallons,
          pounds = gallons * 6;
        this.$percent.val(this.value);
        this.$gallons.text(format(gallons));
        this.$pounds.text(format(pounds));
      },

      onFocus: function() {
        this.$percent.val('');
      },

      onBlur: function(event) {
        var value = clamp(parseInt(event.target.value), 0, 100);
        this.setValue(isNaN(value) ? default_value : value);
      },

      setValue: function(value) {
        this.value = value;
        this.save();
        this.render();
      },

      getValue: function() {
        return this.value;
      },
    };
    panel = Object.create(proto);
    panel.$container = $container;
    panel.name = name;
    panel.value = default_value;
    panel.$percent = $container.find('.fuel-percent');
    panel.$gallons = $container.find('.fuel-gallons');
    panel.$pounds = $container.find('.fuel-pounds');
    return panel;
  };

  renderAction = function() {
    var
      current_value = currentPanel.getValue(),
      target_value = targetPanel.getValue(),
      gallons = 0.01 * (target_value - current_value) * maxGallons;

    $actionGallons.text(format(Math.abs(gallons)));

    if (gallons >= 0) {
      $actionTitle.text('Add');
      $actionPanel.removeClass('panel-danger').addClass('panel-success');
    }
    else {
      $actionTitle.text('Drain');
      $actionPanel.removeClass('panel-success').addClass('panel-danger');
    }
  };

  doAction = function() {
    currentPanel.setValue(targetPanel.getValue());
    renderAction();
  };

  onFocus = function(panel) {
    return function(event) {
      panel.onFocus();
      return true;
    };
  };

  onBlur = function(panel) {
    return function(event) {
      panel.onBlur(event);
      renderAction();
      return true;
    };
  };

  onClickAction = function(event) {
    doAction();
    return true;
  };

  initModule = function(maxGals, $current, $target, $action) {
    maxGallons = maxGals;

    $currentContainer = $current;
    $targetContainer = $target;
    $actionContainer = $action;
    $actionGallons = $actionContainer.find('#fuel-action-gallons');
    $actionPanel = $actionContainer.find('.panel');
    $actionTitle = $actionPanel.find('.panel-title');

    currentPanel = makeLoadPanel($currentContainer, 'current', 0);
    targetPanel = makeLoadPanel($targetContainer, 'target', 100);

    currentPanel.loadOrElseDefault();
    targetPanel.loadOrElseDefault();

    currentPanel.$percent.focus(onFocus(currentPanel));
    targetPanel.$percent.focus(onFocus(targetPanel));
    currentPanel.$percent.blur(onBlur(currentPanel));
    targetPanel.$percent.blur(onBlur(targetPanel));

    $actionContainer.click(onClickAction);

    currentPanel.render();
    targetPanel.render();
    renderAction();
  };

  return {
    initModule: initModule
  };

  // TODO:
  //   - get rid of doAction
  //   - make sure icon used. 
  //   - clean up manifest
  //   - push to github
}(jQuery));

$(document).ready(function() {
  var $current = $('#fuel-current');
  var $target = $('#fuel-target');
  var $action = $('#fuel-action');
  fuel.initModule(57.6, $current, $target, $action);
});
