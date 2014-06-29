fuel = (function($) {
  var
    maxGallons, clamp, current, target, renderCurrent, renderTarget, format,
    renderAction,
    clearCurrent, clearAction, doAction,
    $fuelCurrentPercent, $fuelCurrentGallons, $fuelCurrentPounds,
    $fuelTargetPercent, $fuelTargetGallons, $fuelTargetPounds, $fuelAddGallons,
    $currentContainer, $targetContainer, $addContainer,
    onFocusFuelCurrentPercent, onFocusFuelTargetPercent,
    onBlurFuelCurrentPercent, onBlurFuelTargetPercent,
    onClickAction,
    initModule;

  clamp = function(a, min, max) {
    return Math.min(max, Math.max(min, a));
  };

  format = function(num) {
    return new Number(num).toPrecision(3);
  };

  clearCurrent = function() {
    $fuelCurrentPercent.val('');
  };

  clearTarget = function() {
    $fuelTargetPercent.val('');
  };

  // TODO - factor out commonality with this and the next one
  renderCurrent = function() {
    var gallons = 0.01 * current * maxGallons;
    var pounds = gallons * 6;
    $fuelCurrentPercent.val(current);
    $fuelCurrentGallons.text(format(gallons));
    $fuelCurrentPounds.text(format(pounds));
  };

  renderTarget = function() {
    var gallons = 0.01 * target * maxGallons;
    var pounds = gallons * 6;
    $fuelTargetPercent.val(target);
    $fuelTargetGallons.text(format(gallons));
    $fuelTargetPounds.text(format(pounds));
  };

  renderAction = function() {
    var gallons = 0.01 * (target - current) * maxGallons;
    var $panel = $addContainer.find('.panel');
    var $title = $panel.find('.panel-title');
    $fuelAddGallons.text(format(Math.abs(gallons)));
    if (gallons >= 0) {
      $title.text('Add');
      $panel.removeClass('panel-danger').addClass('panel-success');
    }
    else {
      $title.text('Drain');
      $panel.removeClass('panel-success').addClass('panel-danger');
    }
  };

  doAction = function() {
    current = target;
    localStorage.current = current;
    renderCurrent();
    renderAction();
  };

  // TODO - factor out commonality with this and the next one
  // TODO - factor out the logic of setting current and target (including
  // localStorage)
  onBlurFuelCurrentPercent = function(event) {
    var value = clamp(parseInt(event.target.value), 0, 100);
    current = isNaN(value) ? 0 : value;
    localStorage.current = current;
    renderCurrent();
    renderAction();
    return true;
  };

  onBlurFuelTargetPercent = function(event) {
    var value = clamp(parseInt(event.target.value), 0, 100);
    target = isNaN(value) ? 100 : value;
    localStorage.target = target;
    renderTarget();
    renderAction();
    return true;
  };

  onFocusFuelCurrentPercent = function(event) {
    clearCurrent();
    return true;
  };
  
  onFocusFuelTargetPercent = function(event) {
    clearTarget();
    return true;
  };

  onClickAction = function(event) {
    doAction();
    return true;
  };

  initModule = function(maxGals, $current, $target, $add) {
    maxGallons = maxGals;

    $currentContainer = $current;
    $targetContainer = $target;
    $addContainer = $add;

    $fuelCurrentPercent = $currentContainer.find('#fuel-current-percent');
    $fuelCurrentGallons = $currentContainer.find('#fuel-current-gallons');
    $fuelCurrentPounds = $currentContainer.find('#fuel-current-pounds');

    $fuelTargetPercent = $targetContainer.find('#fuel-target-percent');
    $fuelTargetGallons = $targetContainer.find('#fuel-target-gallons');
    $fuelTargetPounds = $targetContainer.find('#fuel-target-pounds');

    $fuelAddGallons = $addContainer.find('#fuel-add-gallons');

    $fuelCurrentPercent.focus(onFocusFuelCurrentPercent);
    $fuelTargetPercent.focus(onFocusFuelTargetPercent);
    $fuelCurrentPercent.blur(onBlurFuelCurrentPercent);
    $fuelTargetPercent.blur(onBlurFuelTargetPercent);

    $addContainer.click(onClickAction);

    // Current and target loads, as integer percentages.  i.e., 100 --> 100%
    var storedCurrent = localStorage.getItem('current');
    current = storedCurrent === null ? 0 : parseInt(storedCurrent);
    var storedTarget = localStorage.getItem('target');
    target = storedTarget === null ? 100 : parseInt(storedTarget);
    renderCurrent();
    renderTarget();
    renderAction();
  };

  return {
    initModule: initModule
  };

  // TODO:
  //   - make sure icon used. 
  //   - refactor common behavior
  //   - change add container to action, since it isn't always add
  //   - add prompt about adding to home screen
  //   - clean up manifest
  //   - push to github
}(jQuery));

$(document).ready(function() {
  var $current = $('#fuel-current');
  var $target = $('#fuel-target');
  var $add = $('#fuel-add');
  fuel.initModule(57.6, $current, $target, $add);
});
