Bluff.StackedBar = new JS.Class(Bluff.Base, {
  include: Bluff.Base.StackedMixin,

  // Draws a bar graph, but multiple sets are stacked on top of each other.
  draw: function() {
    this._get_maximum_by_stack();
    this.callSuper();
    if (!this._has_data) return;
    
    // Setup spacing.
    //
    // Columns sit stacked.
    var spacing_factor = 0.9;
    this._bar_width = this._graph_width / this._column_count;
    var padding = (this._bar_width * (1 - spacing_factor)) / 2;
    
    var height = [], i = this._column_count;
    while (i--) height.push(0);
  
    Bluff.each(this._norm_data, function(data_row, row_index) {
      
      Bluff.each(data_row[this.klass.DATA_VALUES_INDEX], function(data_point, point_index) {
        // Calculate center based on bar_width and current row
        var label_center = this._graph_left + (this._bar_width * point_index) + (this._bar_width * spacing_factor / 2.0) + padding;
        this._draw_label(label_center, point_index);
        
        if (data_point == 0) return;
        // Use incremented x and scaled y
        var left_x = this._graph_left + (this._bar_width * point_index) + padding;
        var left_y = this._graph_top + (this._graph_height -
                               data_point * this._graph_height - 
                               height[point_index]) + 1;
        var right_x = left_x + this._bar_width * spacing_factor;
        var right_y = this._graph_top + this._graph_height - height[point_index] - 1;
        
        // update the total height of the current stacked bar
        height[point_index] += (data_point * this._graph_height);
        
        this._d.fill = data_row[this.klass.DATA_COLOR_INDEX];
        this._d.rectangle(left_x, left_y, right_x, right_y);
      }, this);
    }, this);
  }
});

