import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

class Pomo extends Component {

    constructor(props) {
        super(props);
        this.state = {state: 'working', ticks: 0}
        const ival = setInterval(() => {this.tick();}, props.ticksecs * 1000);
        this.state.ival = ival;

    }

    defaultState() {
        return {state: 'working', ticks: 0};
    }

    tick() {
        if (this.state.state === 'working' ) {
            if (this.state.ticks < this.props.ticks) {
                this.setState({
                    ticks: this.state.ticks + 1
                });
            } else {
                clearInterval(this.state.ival);
                this.setState({
                    state: 'breaking',
                    ticks: 0
                });
                const ival = setInterval(() => {
                    this.tick();
                }, this.props.ticksecs * 1000);
                this.setState({
                    ival: ival
                });
            }
        } else if (this.state.state === 'breaking' ) {
            if (this.state.ticks < this.props.breakticks) {
                this.setState({
                    ticks: this.state.ticks + 1
                });
            } else {
                clearInterval(this.state.ival);
                this.setState({
                    state: 'ready',
                    ticks: 0
                });
            }
        } else {
                this.setState({
                    state: 'working',
                    ticks: 0
                });
                const ival = setInterval(() => {this.tick();}, this.props.ticksecs * 1000);
                this.setState({
                    ival: ival
                });
        }
    }

    readyBox() {
        return (
            <bigtext content="READY"
                 top="center"
                 left="center"
                 height="30%"
                 width="45%"
                 clickable={true}
                 keyable={true}
                 onClick={() => {this.tick()}}
                 onInput={() => {this.tick()}}
                 border={{type: 'none'}}
                 style={{border: {fg: 'green'}, fg: 'green'}} >
                READY?
            </bigtext>
        )
    }

    workingBox() {
        return (
          <progressbar orientation="horizontal"
                        filled={((this.state.ticks / this.props.ticks) * 100)}
                        top="42.5%"
                        left="center"
                        height="15%"
                        width="80%"
                         clickable={true}
                         keyable={true}
                         onClick={() => {this.tick()}}
                         onInput={() => {this.tick()}}
                        label={this.state.ticks / 4 + "m"}
                        border={{type: 'line'}}
                        style={{border: {fg: 'red'}, bar: {bg: 'red'}}} />
        )
    }

    breakingBox() {
        return (
          <progressbar orientation="horizontal"
                        filled={100 - ((this.state.ticks / this.props.breakticks) * 100)}
                        top="42.5%"
                        left="center"
                        height="15%"
                        width="80%"
                         clickable={true}
                         keyable={true}
                         onClick={() => {this.tick()}}
                         onInput={() => {this.tick()}}
                        label={this.state.ticks / 4 + "m"}
                        border={{type: 'line'}}
                        style={{border: {fg: 'blue'}, bar: {bg: 'blue'}}} />
        )
    }

  render() {
      const boxColor =
          this.state.state === 'working' ? 'red' :
          (this.state.state === 'breaking' ? 'blue' : 'green');

      const box =
          this.state.state === 'working' ? this.workingBox() :
          (this.state.state === 'breaking' ? this.breakingBox() : this.readyBox());

      const app = (
          <box style={{ bg: boxColor }}
                keyable="true">
               {box}
          </box>
      );

      return app;
  }
}


const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed demo app'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const _tick = c => {c.tick()};

const component = render(<Pomo
                         ticks={100}
                         ticksecs={15}
                         breakticks={20} />, screen);

screen.key(['enter'],function(ch, key) {
    _tick(component);
});
