Bluff.Line = new JS.Class(Bluff.Base, {
  // Draw a dashed line at the given value
  baseline_value: null,
	
  // Color of the baseline
  baseline_color: null,
  
  // Hide parts of the graph to fit more datapoints, or for a different appearance.
  hide_dots: null,
  hide_lines: null,

  // Call with target pixel width of graph (800, 400, 300), and/or 'false' to omit lines (points only).
  //
  //  g = new Bluff.Line('canvasId', 400) // 400px wide with lines
  //
  //  g = new Bluff.Line('canvasId', 400, false) // 400px wide, no lines (for backwards compatibility)
  //
  //  g = new Bluff.Line('canvasId', false) // Defaults to 800px wide, no lines (for backwards compatibility)
  // 
  // The preferred way is to call hide_dots or hide_lines instead.
  initialize: function(renderer) {
    if (arguments.length > 3) throw 'Wrong number of arguments';
    if (arguments.length == 1 || (typeof arguments[1] != 'number' && typeof arguments[1] != 'string'))
      this.callSuper(renderer, null);
    else
      this.callSuper();
    
    this.hide_dots = this.hide_lines = false;
    this.baseline_color = 'red';
    this.baseline_value = null;
  },
  
  draw: function() {
    this.callSuper();
    
    if (!this._has_data) return;
    
    // Check to see if more than one datapoint was given. NaN can result otherwise.
    this.x_increment = (this._column_count > 1) ? (this._graph_width / (this._column_count - 1)) : this._graph_width;
    
    var level;
    
    if (this._norm_baseline !== undefined) {
      level = this._graph_top + (this._graph_height - this._norm_baseline * this._graph_height);
      this._d.push();
      this._d.stroke = this.baseline_color;
      // TODO, opacity, dashes
      this._d.stroke_width = 3.0;
      this._d.line(this._graph_left, level, this._graph_left + this._graph_width, level);
      this._d.pop();
    }
    
    Bluff.each(this._norm_data, function(data_row) {
      var prev_x = null, prev_y = null;
      
      Bluff.each(data_row[this.klass.DATA_VALUES_INDEX], function(data_point, index) {
        var new_x = this._graph_left + (this.x_increment * index);
        if (data_point === undefined) return;
        
        this._draw_label(new_x, index);
        
        var new_y = this._graph_top + (this._graph_height - data_point * this._graph_height);
        
        // Reset each time to avoid thin-line errors
        this._d.stroke = data_row[this.klass.DATA_COLOR_INDEX];
        this._d.fill = data_row[this.klass.DATA_COLOR_INDEX];
        this._d.stroke_opacity = 1.0;
        this._d.stroke_width = this._clip_value_if_greater_than(this._columns / (this._norm_data[0][1].length * 6), 3.0);
        
        if (!this.hide_lines && prev_x !== null && prev_y !== null)
          this._d.line(prev_x, prev_y, new_x, new_y);
        
        var circle_radius = this._clip_value_if_greater_than(this._columns / (this._norm_data[0][1].length * 2), 7.0);
        if (!this.hide_dots) this._d.circle(new_x, new_y, new_x - circle_radius, new_y);
        
        prev_x = new_x;
        prev_y = new_y;
      }, this);
    }, this);
  },
  
  _normalize: function() {
    this.maximum_value = Math.max(this.maximum_value, this.baseline_value);
    this.callSuper();
    if (this.baseline_value !== null) this._norm_baseline = this.baseline_value / this.maximum_value;
  }
});

