import React,{ Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontAwesome from "react-fontawesome";
import { Collapse, Navbar, NavbarToggler, 
         NavbarBrand, Nav, NavItem, NavLink,
        Button,Popover,PopoverBody} from 'reactstrap';
import PropTypes from 'prop-types';

import fetchProgress from '../network/progress';

var CalendarWidget = require('react-calendar-widget');  

var ReactDOM = require('react-dom');

import { getGarminToken,logoutUser} from '../network/auth';
 class DashboardSummary extends Component{
constructor(props){
    super(props);
    this.state ={
        selectedDate: new Date(),
        isOpen: false,
        calendarOpen:false,

        "created_at":"-",
        "summary":{
            "overall_health":{
               "overall_health_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"

                     },
                 "overall_health_gpa_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"

                     },
                 "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"

                     },
                 "total_gpa_point":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"

                     }
                },

            "ec":{
                 "avg_no_of_days_exercises_per_week":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                  "exercise_consistency_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                   "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                   "exercise_consistency_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     }
                 },
                "nutrition":{
                   "prcnt_unprocessed_food_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                 "prcnt_unprocessed_food_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                 "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                  "prcnt_unprocessed_volume_of_food":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     }

                  },
            "mc":{
                "movement_consistency_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                     "movement_consistency_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                     "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                     "movement_consistency_score":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     }
                  },
            "non_exercise":{
                 "non_exericse_steps_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                 "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                 "movement_non_exercise_step_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                 "non_exercise_steps":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                "total_steps":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },     
            },
        "exercise":{
           "workout_duration_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },    
            "overall_workout_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },    
            "workout_duration_hours_min":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     }, 
                "rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },    
                "avg_exercise_heart_rate":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },    
                "overall_exercise_gpa_rank":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                "workout_effort_level_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                "avg_exercise_heart_rate_grade":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                "overall_exercise_gpa":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     },
                "workout_effort_level":{
                        "week":"-",
                        "yesterday":"-",
                        "month":"-",
                        "custom_range":{
                           "from_dt" :"-",
                           "to_dt":"-",
                           "data":"-"
                        },
                        "today":"-",
                        "year":"-"
                     }        
                },

        "penalty":{
             "sleep_aid_penalty": {
                "week":"-",
                "yesterday":"-",
                "month":"-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data":"-"
                },
                "today":"-",
                "year":"-"
            },
            "controlled_substance_penalty": {
                "week":"-",
                "yesterday":"-",
                "month":"-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "smoking_penalty": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
        },
         "sleep": {
            "average_sleep_grade": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "rank": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "total_sleep_in_hours_min": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "overall_sleep_gpa": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            }
        },
         "alcohol": {
            "alcoholic_drinks_per_week_grade": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "avg_drink_per_week": {
                "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "rank": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            },
            "alcoholic_drinks_per_week_gpa": {
               "week": "-",
                "yesterday": "-",
                "month": "-",
                "custom_range": {
                    "from_dt": "-",
                    "to_dt": "-",
                    "data": "-"
                },
                "today": "-",
                "year": "-"
            }
        }
              
        }

    };
    this.successProgress = this.successProgress.bind(this);
    this.errorProgress = this.errorProgress.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.onLogoutSuccess = this.onLogoutSuccess.bind(this);
    this.processDate = this.processDate.bind(this);
   this.toggleCalendar=this.toggleCalendar.bind(this);
  }

  successProgress(data){
    this.setState({
        //  created_at:data.data.created_at,
        // summary:{
        //     overall_health:{
        //        overall_health_gpa:{
        //                 week:data.data.summary.overall_health.overall_health_gpa.week,
        //                 yesterday:data.data.summary.overall_health.overall_health_gpa.yesterday,
        //                 month:data.data.summary.overall_health.overall_health_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.overall_health.overall_health_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.overall_health.overall_health_gpa.custom_range.to_dt,
        //                    data:data.data.summary.overall_health.overall_health_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.overall_health.overall_health_gpa.today,
        //                 year:data.data.summary.overall_health.overall_health_gpa.year

        //              },
        //          overall_health_gpa_grade:{
        //                 week:data.data.summary.overall_health.overall_health_gpa_grade.week,
        //                 yesterday:data.data.summary.overall_health.overall_health_gpa_grade.yesterday,
        //                 month:data.data.summary.overall_health.overall_health_gpa_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.overall_health.overall_health_gpa_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.overall_health.overall_health_gpa_grade.custom_range.to_dt,
        //                    data:data.data.summary.overall_health.overall_health_gpa_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.overall_health.overall_health_gpa_grade.today,
        //                 year:data.data.summary.overall_health.overall_health_gpa_grade.year

        //              },
        //          rank:{
        //                  week:data.data.summary.overall_health.rank.week,
        //                 yesterday:data.data.summary.overall_health.rank.yesterday,
        //                 month:data.data.summary.overall_health.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.overall_health.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.overall_health.rank.custom_range.to_dt,
        //                    data:data.data.summary.overall_health.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.overall_health.rank.today,
        //                 year:data.data.summary.overall_health.rank.year

        //              },
        //          total_gpa_point:{
        //                 week:data.data.summary.overall_health.total_gpa_point.week,
        //                 yesterday:data.data.summary.overall_health.total_gpa_point.yesterday,
        //                 month:data.data.summary.overall_health.total_gpa_point.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.overall_health.total_gpa_point.custom_range.from_dt,
        //                    to_dt:data.data.summary.overall_health.total_gpa_point.custom_range.to_dt,
        //                    data:data.data.summary.overall_health.total_gpa_point.custom_range.data
        //                 },
        //                 today:data.data.summary.overall_health.total_gpa_point.today,
        //                 year:data.data.summary.overall_health.total_gpa_point.year
        //              }
        //         },

        //     ec:{
        //          avg_no_of_days_exercises_per_week:{
        //                 week:data.data.summary.ec.avg_no_of_days_exercises_per_week.week,
        //                 yesterday:data.data.summary.ec.avg_no_of_days_exercises_per_week.yesterday,
        //                 month:data.data.summary.ec.avg_no_of_days_exercises_per_week.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.ec.avg_no_of_days_exercises_per_week.custom_range.from_dt,
        //                    to_dt:data.data.summary.ec.avg_no_of_days_exercises_per_week.custom_range.to_dt,
        //                    data:data.data.summary.ec.avg_no_of_days_exercises_per_week.custom_range.data
        //                 },
        //                 today:data.data.summary.ec.avg_no_of_days_exercises_per_week.today,
        //                 year:data.data.summary.ec.avg_no_of_days_exercises_per_week.year
        //              },
        //           exercise_consistency_grade:{
        //                 week:data.data.summary.ec.exercise_consistency_grade.week,
        //                 yesterday:data.data.summary.ec.exercise_consistency_grade.yesterday,
        //                 month:data.data.summary.ec.exercise_consistency_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.ec.exercise_consistency_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.ec.exercise_consistency_grade.custom_range.to_dt,
        //                    data:data.data.summary.ec.exercise_consistency_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.ec.exercise_consistency_grade.today,
        //                 year:data.data.summary.ec.exercise_consistency_grade.year
        //              },
        //            rank:{
        //                 week:data.data.summary.ec.rank.week,
        //                 yesterday:data.data.summary.ec.rank.yesterday,
        //                 month:data.data.summary.ec.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.ec.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.ec.rank.custom_range.to_dt,
        //                    data:data.data.summary.ec.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.ec.rank.today,
        //                 year:data.data.summary.ec.rank.year
        //              },
        //            exercise_consistency_gpa:{
        //                 week:data.data.summary.ec.exercise_consistency_gpa.week,
        //                 yesterday:data.data.summary.ec.exercise_consistency_gpa.yesterday,
        //                 month:data.data.summary.ec.exercise_consistency_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.ec.exercise_consistency_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.ec.exercise_consistency_gpa.custom_range.to_dt,
        //                    data:data.data.summary.ec.exercise_consistency_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.ec.exercise_consistency_gpa.today,
        //                 year:data.data.summary.ec.exercise_consistency_gpa.year
        //              }
        //          },
        //         nutrition:{
        //            prcnt_unprocessed_food_gpa:{
        //                week:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.week,
        //                 yesterday:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday,
        //                 month:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.to_dt,
        //                    data:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.today,
        //                 year:data.data.summary.nutrition.prcnt_unprocessed_food_gpa.year
        //              },
        //          prcnt_unprocessed_food_grade:{
        //                  week:data.data.summary.nutrition.prcnt_unprocessed_food_grade.week,
        //                 yesterday:data.data.summary.nutrition.prcnt_unprocessed_food_grade.yesterday,
        //                 month:data.data.summary.nutrition.prcnt_unprocessed_food_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.to_dt,
        //                    data:data.data.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.nutrition.prcnt_unprocessed_food_grade.today,
        //                 year:data.data.summary.nutrition.prcnt_unprocessed_food_grade.year
        //              },
        //          rank:{
        //                  week:data.data.summary.nutrition.rank.week,
        //                 yesterday:data.data.summary.nutrition.rank.yesterday,
        //                 month:data.data.summary.nutrition.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.nutrition.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.nutrition.rank.custom_range.to_dt,
        //                    data:data.data.summary.nutrition.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.nutrition.rank.today,
        //                 year:data.data.summary.nutrition.rank.year
        //              },
        //           prcnt_unprocessed_volume_of_food:{
        //                  week:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.week,
        //                 yesterday:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday,
        //                 month:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.from_dt,
        //                    to_dt:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.to_dt,
        //                    data:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.data
        //                 },
        //                 today:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.today,
        //                 year:data.data.summary.nutrition.prcnt_unprocessed_volume_of_food.year
        //              }

        //           },
        //     mc:{
        //         movement_consistency_gpa:{
        //                 week:data.data.summary.mc.movement_consistency_gpa.week,
        //                 yesterday:data.data.summary.mc.movement_consistency_gpa.yesterday,
        //                 month:data.data.summary.mc.movement_consistency_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.mc.movement_consistency_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.mc.movement_consistency_gpa.custom_range.to_dt,
        //                    data:data.data.summary.mc.movement_consistency_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.mc.movement_consistency_gpa.today,
        //                 year:data.data.summary.mc.movement_consistency_gpa.year
        //              },
        //              movement_consistency_grade:{
        //                 week:data.data.summary.mc.movement_consistency_grade.week,
        //                 yesterday:data.data.summary.mc.movement_consistency_grade.yesterday,
        //                 month:data.data.summary.mc.movement_consistency_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.mc.movement_consistency_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.mc.movement_consistency_grade.custom_range.to_dt,
        //                    data:data.data.summary.mc.movement_consistency_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.mc.movement_consistency_grade.today,
        //                 year:data.data.summary.mc.movement_consistency_grade.year
        //              },
        //              rank:{
        //                week:data.data.summary.mc.rank.week,
        //                 yesterday:data.data.summary.mc.rank.yesterday,
        //                 month:data.data.summary.mc.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.mc.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.mc.rank.custom_range.to_dt,
        //                    data:data.data.summary.mc.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.mc.rank.today,
        //                 year:data.data.summary.mc.rank.year
        //              },
        //              movement_consistency_score:{
        //                week:data.data.summary.mc.movement_consistency_score.week,
        //                 yesterday:data.data.summary.mc.movement_consistency_score.yesterday,
        //                 month:data.data.summary.mc.movement_consistency_score.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.mc.movement_consistency_score.custom_range.from_dt,
        //                    to_dt:data.data.summary.mc.movement_consistency_score.custom_range.to_dt,
        //                    data:data.data.summary.mc.movement_consistency_score.custom_range.data
        //                 },
        //                 today:data.data.summary.mc.movement_consistency_score.today,
        //                 year:data.data.summary.mc.movement_consistency_score.year
        //              }
        //           },
        //     non_exercise:{
        //          non_exericse_steps_gpa:{
        //                 week:data.data.summary.non_exercise.non_exericse_steps_gpa.week,
        //                 yesterday:data.data.summary.non_exercise.non_exericse_steps_gpa.yesterday,
        //                 month:data.data.summary.non_exercise.non_exericse_steps_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.non_exercise.non_exericse_steps_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.non_exercise.non_exericse_steps_gpa.custom_range.to_dt,
        //                    data:data.data.summary.non_exercise.non_exericse_steps_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.non_exercise.non_exericse_steps_gpa.today,
        //                 year:data.data.summary.non_exercise.non_exericse_steps_gpa.year
        //              },
        //          rank:{
        //                 week:data.data.summary.non_exercise.rank.week,
        //                 yesterday:data.data.summary.non_exercise.rank.yesterday,
        //                 month:data.data.summary.non_exercise.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.non_exercise.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.non_exercise.rank.custom_range.to_dt,
        //                    data:data.data.summary.non_exercise.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.non_exercise.rank.today,
        //                 year:data.data.summary.non_exercise.rank.year
        //              },
        //          movement_non_exercise_step_grade:{
        //                  week:data.data.summary.non_exercise.movement_non_exercise_step_grade.week,
        //                 yesterday:data.data.summary.non_exercise.movement_non_exercise_step_grade.yesterday,
        //                 month:data.data.summary.non_exercise.movement_non_exercise_step_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.non_exercise.movement_non_exercise_step_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.non_exercise.movement_non_exercise_step_grade.custom_range.to_dt,
        //                    data:data.data.summary.non_exercise.movement_non_exercise_step_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.non_exercise.movement_non_exercise_step_grade.today,
        //                 year:data.data.summary.non_exercise.movement_non_exercise_step_grade.year
        //              },
        //          non_exercise_steps:{
        //                 week:data.data.summary.non_exercise.non_exercise_steps.week,
        //                 yesterday:data.data.summary.non_exercise.non_exercise_steps.yesterday,
        //                 month:data.data.summary.non_exercise.non_exercise_steps.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.non_exercise.non_exercise_steps.custom_range.from_dt,
        //                    to_dt:data.data.summary.non_exercise.non_exercise_steps.custom_range.to_dt,
        //                    data:data.data.summary.non_exercise.non_exercise_steps.custom_range.data
        //                 },
        //                 today:data.data.summary.non_exercise.non_exercise_steps.today,
        //                 year:data.data.summary.non_exercise.non_exercise_steps.year
        //              },
        //         total_steps:{
        //                  week:data.data.summary.non_exercise.total_steps.week,
        //                 yesterday:data.data.summary.non_exercise.total_steps.yesterday,
        //                 month:data.data.summary.non_exercise.total_steps.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.non_exercise.total_steps.custom_range.from_dt,
        //                    to_dt:data.data.summary.non_exercise.total_steps.custom_range.to_dt,
        //                    data:data.data.summary.non_exercise.total_steps.custom_range.data
        //                 },
        //                 today:data.data.summary.non_exercise.total_steps.today,
        //                 year:data.data.summary.non_exercise.total_steps.year
        //              },     
        //     },
        // exercise:{
        //    workout_duration_grade:{
        //                 week:data.data.summary.exercise.workout_duration_grade.week,
        //                 yesterday:data.data.summary.exercise.workout_duration_grade.yesterday,
        //                 month:data.data.summary.exercise.workout_duration_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.workout_duration_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.workout_duration_grade.custom_range.to_dt,
        //                    data:data.data.summary.exercise.workout_duration_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.workout_duration_grade.today,
        //                 year:data.data.summary.exercise.workout_duration_grade.year
        //              },    
        //     overall_workout_grade:{
        //                 week:data.data.summary.exercise.overall_workout_grade.week,
        //                 yesterday:data.data.summary.exercise.overall_workout_grade.yesterday,
        //                 month:data.data.summary.exercise.overall_workout_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.overall_workout_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.overall_workout_grade.custom_range.to_dt,
        //                    data:data.data.summary.exercise.overall_workout_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.overall_workout_grade.today,
        //                 year:data.data.summary.exercise.overall_workout_grade.year
        //              },    
        //     workout_duration_hours_min:{
        //                 week:data.data.summary.exercise.workout_duration_hours_min.week,
        //                 yesterday:data.data.summary.exercise.workout_duration_hours_min.yesterday,
        //                 month:data.data.summary.exercise.workout_duration_hours_min.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.workout_duration_hours_min.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.workout_duration_hours_min.custom_range.to_dt,
        //                    data:data.data.summary.exercise.workout_duration_hours_min.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.workout_duration_hours_min.today,
        //                 year:data.data.summary.exercise.workout_duration_hours_min.year
        //              }, 
        //         rank:{
        //                 week:data.data.summary.exercise.rank.week,
        //                 yesterday:data.data.summary.exercise.rank.yesterday,
        //                 month:data.data.summary.exercise.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.rank.custom_range.to_dt,
        //                    data:data.data.summary.exercise.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.rank.today,
        //                 year:data.data.summary.exercise.rank.year
        //              },    
        //         avg_exercise_heart_rate:{
        //                 week:data.data.summary.exercise.avg_exercise_heart_rate.week,
        //                 yesterday:data.data.summary.exercise.avg_exercise_heart_rate.yesterday,
        //                 month:data.data.summary.exercise.avg_exercise_heart_rate.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.avg_exercise_heart_rate.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.avg_exercise_heart_rate.custom_range.to_dt,
        //                    data:data.data.summary.exercise.avg_exercise_heart_rate.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.avg_exercise_heart_rate.today,
        //                 year:data.data.summary.exercise.avg_exercise_heart_rate.year
        //              },    
        //         overall_exercise_gpa_rank:{
        //                 week:data.data.summary.exercise.overall_exercise_gpa_rank.week,
        //                 yesterday:data.data.summary.exercise.overall_exercise_gpa_rank.yesterday,
        //                 month:data.data.summary.exercise.overall_exercise_gpa_rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.overall_exercise_gpa_rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.overall_exercise_gpa_rank.custom_range.to_dt,
        //                    data:data.data.summary.exercise.overall_exercise_gpa_rank.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.overall_exercise_gpa_rank.today,
        //                 year:data.data.summary.exercise.overall_exercise_gpa_rank.year
        //              },
        //         workout_effort_level_grade:{
        //                 week:data.data.summary.exercise.workout_effort_level_grade.week,
        //                 yesterday:data.data.summary.exercise.workout_effort_level_grade.yesterday,
        //                 month:data.data.summary.exercise.workout_effort_level_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.workout_effort_level_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.workout_effort_level_grade.custom_range.to_dt,
        //                    data:data.data.summary.exercise.workout_effort_level_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.workout_effort_level_grade.today,
        //                 year:data.data.summary.exercise.workout_effort_level_grade.year
        //              },
        //         avg_exercise_heart_rate_grade:{
        //                 week:data.data.summary.exercise.avg_exercise_heart_rate_grade.week,
        //                 yesterday:data.data.summary.exercise.avg_exercise_heart_rate_grade.yesterday,
        //                 month:data.data.summary.exercise.avg_exercise_heart_rate_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.avg_exercise_heart_rate_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.avg_exercise_heart_rate_grade.custom_range.to_dt,
        //                    data:data.data.summary.exercise.avg_exercise_heart_rate_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.avg_exercise_heart_rate_grade.today,
        //                 year:data.data.summary.exercise.avg_exercise_heart_rate_grade.year
        //              },
        //         overall_exercise_gpa:{
        //                 week:data.data.summary.exercise.overall_exercise_gpa.week,
        //                 yesterday:data.data.summary.exercise.overall_exercise_gpa.yesterday,
        //                 month:data.data.summary.exercise.overall_exercise_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.overall_exercise_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.overall_exercise_gpa.custom_range.to_dt,
        //                    data:data.data.summary.exercise.overall_exercise_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.overall_exercise_gpa.today,
        //                 year:data.data.summary.exercise.overall_exercise_gpa.year
        //              },
        //         workout_effort_level:{
        //                 week:data.data.summary.exercise.workout_effort_level.week,
        //                 yesterday:data.data.summary.exercise.workout_effort_level.yesterday,
        //                 month:data.data.summary.exercise.workout_effort_level.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.exercise.workout_effort_level.custom_range.from_dt,
        //                    to_dt:data.data.summary.exercise.workout_effort_level.custom_range.to_dt,
        //                    data:data.data.summary.exercise.workout_effort_level.custom_range.data
        //                 },
        //                 today:data.data.summary.exercise.workout_effort_level.today,
        //                 year:data.data.summary.exercise.workout_effort_level.year
        //              }        
        //         },

        // penalty:{
        //      sleep_aid_penalty: {
        //                 week:data.data.summary.penalty.sleep_aid_penalty.week,
        //                 yesterday:data.data.summary.penalty.sleep_aid_penalty.yesterday,
        //                 month:data.data.summary.penalty.sleep_aid_penalty.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.penalty.sleep_aid_penalty.custom_range.from_dt,
        //                    to_dt:data.data.summary.penalty.sleep_aid_penalty.custom_range.to_dt,
        //                    data:data.data.summary.penalty.sleep_aid_penalty.custom_range.data
        //                 },
        //                 today:data.data.summary.penalty.sleep_aid_penalty.today,
        //                 year:data.data.summary.penalty.sleep_aid_penalty.year
        //             },
        //     controlled_substance_penalty: {
        //                 week:data.data.summary.penalty.controlled_substance_penalty.week,
        //                 yesterday:data.data.summary.penalty.controlled_substance_penalty.yesterday,
        //                 month:data.data.summary.penalty.controlled_substance_penalty.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.penalty.controlled_substance_penalty.custom_range.from_dt,
        //                    to_dt:data.data.summary.penalty.controlled_substance_penalty.custom_range.to_dt,
        //                    data:data.data.summary.penalty.controlled_substance_penalty.custom_range.data
        //                 },
        //                 today:data.data.summary.penalty.controlled_substance_penalty.today,
        //                 year:data.data.summary.penalty.controlled_substance_penalty.year
        //              },
        //     smoking_penalty: {
        //                 week:data.data.summary.penalty.smoking_penalty.week,
        //                 yesterday:data.data.summary.penalty.smoking_penalty.yesterday,
        //                 month:data.data.summary.penalty.smoking_penalty.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.penalty.smoking_penalty.custom_range.from_dt,
        //                    to_dt:data.data.summary.penalty.smoking_penalty.custom_range.to_dt,
        //                    data:data.data.summary.penalty.smoking_penalty.custom_range.data
        //                 },
        //                 today:data.data.summary.penalty.smoking_penalty.today,
        //                 year:data.data.summary.penalty.smoking_penalty.year
        //     },
        // },
        //  sleep: {
        //     average_sleep_grade: {
        //                 week:data.data.summary.sleep.average_sleep_grade.week,
        //                 yesterday:data.data.summary.sleep.average_sleep_grade.yesterday,
        //                 month:data.data.summary.sleep.average_sleep_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.sleep.average_sleep_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.sleep.average_sleep_grade.custom_range.to_dt,
        //                    data:data.data.summary.sleep.average_sleep_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.sleep.average_sleep_grade.today,
        //                 year:data.data.summary.sleep.average_sleep_grade.year
        //              },
        //     rank: {
        //                 week:data.data.summary.sleep.rank.week,
        //                 yesterday:data.data.summary.sleep.rank.yesterday,
        //                 month:data.data.summary.sleep.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.sleep.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.sleep.rank.custom_range.to_dt,
        //                    data:data.data.summary.sleep.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.sleep.rank.today,
        //                 year:data.data.summary.sleep.rank.year
        //             },
        //     total_sleep_in_hours_min: {
        //                 week:data.data.summary.sleep.total_sleep_in_hours_min.week,
        //                 yesterday:data.data.summary.sleep.total_sleep_in_hours_min.yesterday,
        //                 month:data.data.summary.sleep.total_sleep_in_hours_min.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.sleep.total_sleep_in_hours_min.custom_range.from_dt,
        //                    to_dt:data.data.summary.sleep.total_sleep_in_hours_min.custom_range.to_dt,
        //                    data:data.data.summary.sleep.total_sleep_in_hours_min.custom_range.data
        //                 },
        //                 today:data.data.summary.sleep.total_sleep_in_hours_min.today,
        //                 year:data.data.summary.sleep.total_sleep_in_hours_min.year
        //             },
        //     overall_sleep_gpa: {
        //                 week:data.data.summary.sleep.overall_sleep_gpa.week,
        //                 yesterday:data.data.summary.sleep.overall_sleep_gpa.yesterday,
        //                 month:data.data.summary.sleep.overall_sleep_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.sleep.overall_sleep_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.sleep.overall_sleep_gpa.custom_range.to_dt,
        //                    data:data.data.summary.sleep.overall_sleep_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.sleep.overall_sleep_gpa.today,
        //                 year:data.data.summary.sleep.overall_sleep_gpa.year
        //              }
        //        },
        //  alcohol: {
        //     alcoholic_drinks_per_week_grade: {
        //                 week:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.week,
        //                 yesterday:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday,
        //                 month:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.from_dt,
        //                    to_dt:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.to_dt,
        //                    data:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.data
        //                 },
        //                 today:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.today,
        //                 year:data.data.summary.alcohol.alcoholic_drinks_per_week_grade.year
        //     },
        //     avg_drink_per_week: {
        //                 week:data.data.summary.alcohol.avg_drink_per_week.week,
        //                 yesterday:data.data.summary.alcohol.avg_drink_per_week.yesterday,
        //                 month:data.data.summary.alcohol.avg_drink_per_week.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.alcohol.avg_drink_per_week.custom_range.from_dt,
        //                    to_dt:data.data.summary.alcohol.avg_drink_per_week.custom_range.to_dt,
        //                    data:data.data.summary.alcohol.avg_drink_per_week.custom_range.data
        //                 },
        //                 today:data.data.summary.alcohol.avg_drink_per_week.today,
        //                 year:data.data.summary.alcohol.avg_drink_per_week.year
        //     },
        //     rank: {
        //                week:data.data.summary.alcohol.rank.week,
        //                 yesterday:data.data.summary.alcohol.rank.yesterday,
        //                 month:data.data.summary.alcohol.rank.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.alcohol.rank.custom_range.from_dt,
        //                    to_dt:data.data.summary.alcohol.rank.custom_range.to_dt,
        //                    data:data.data.summary.alcohol.rank.custom_range.data
        //                 },
        //                 today:data.data.summary.alcohol.rank.today,
        //                 year:data.data.summary.alcohol.rank.year
        //     },
        //     alcoholic_drinks_per_week_gpa: {
        //                 week:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.week,
        //                 yesterday:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday,
        //                 month:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.month,
        //                 custom_range:{
        //                    from_dt :data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.from_dt,
        //                    to_dt:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.to_dt,
        //                    data:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.data
        //                 },
        //                 today:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.today,
        //                 year:data.data.summary.alcohol.alcoholic_drinks_per_week_gpa.year
        //     }
        // }
              
        // }
    })
  }

  
   errorProgress(error){
       console.log(error.message);
    }

    processDate(selectedDate){
    console.log(selectedDate);
    this.setState({
      selectedDate: selectedDate,
    },()=>{
      fetchProgress(this.state.selectedDate,this.successProgress,this.errorProgress);
    });
  }

    componentDidMount(){
      fetchProgress(this.state.selectedDate,this.successProgress,this.errorProgress);
    }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
     
    });
  }

  onLogoutSuccess(response){
    this.props.history.push("/#logout");
  }

  handleLogout(){
    this.props.logoutUser(this.onLogoutSuccess);
  }
  toggleCalendar(){
    this.setState({
      calendarOpen:!this.state.calendarOpen
    });
  }

	render(){
		const {fix} = this.props;
		return(
			<div className="dashboard">
		<div className="container-fluid">
        

		 <Navbar toggleable
         fixed={fix ? 'top' : ''}
          className="navbar navbar-expand-sm navbar-inverse nav6">
          <NavbarToggler className="navbar-toggler hidden-sm-up" onClick={this.toggle} >
           <FontAwesome
                 name = "bars"
                 size = "1x"

             />

          </NavbarToggler>

          <Link to='/' >
            <NavbarBrand
              className="navbar-brand float-sm-left"
              id="navbarTogglerDemo" style={{fontSize:"16px",marginLeft:"-4px"}}>
              <img className="img-fluid"
               style={{maxWidth:"200px"}}
               src="//static1.squarespace.com/static/535dc0f7e4b0ab57db48c65c/t/5942be8b893fc0b88882a5fb/1504135828049/?format=1500w"/>
            </NavbarBrand>
          </Link>



            <span id="header">
            <h2 className="head" id="head">Progress Analyzer
            </h2>
            </span>
             


          <Collapse className="navbar-toggleable-xs" isOpen={this.state.isOpen} navbar>
            <Nav className="nav navbar-nav float-xs-right ml-auto" navbar>
              <NavItem className="float-sm-right">
                <Link id="logout"className="nav-link" to='/'>Home</Link>
              </NavItem>
               <NavItem className="float-sm-right">
                   <NavLink
                   className="nav-link"
                   id="logout"
                   onClick={this.handleLogout}>Log Out
                    </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

      </div> 
      <div> 
      <span id="navlink" onClick={this.toggleCalendar} id="progress">
                <FontAwesome
                    name = "calendar"
                    size = "2x"

                />
      </span>               
            <span className="pdf_button" id="pdf_button">
            <Button className="btn createbutton">Create PDF</Button>
            </span>
      </div>
                                        
             <Popover
                            placement="bottom"
                            isOpen={this.state.calendarOpen}
                            target="progress"
                            toggle={this.toggleCalendar}>
                              <PopoverBody className="calendar2">
                                <CalendarWidget  onDaySelect={this.processDate}/>
                              </PopoverBody>
                           </Popover>

			<div className="col-sm-12 col-md-12 col-lg-12 padding">
			<div className="row">
			<div className="col-md-6">
			<div className="table-responsive"> 
   		 <table className="table table-bordered">
         <thead>
            <tr>
                <th >Overall Health Grade</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td >Total GPA Points</td>
                <td>{this.state.summary.overall_health.total_gpa_point.custom_range.from_dt} to
                 {this.state.summary.overall_health.total_gpa_point.custom_range.to_dt} value
                 {this.state.summary.overall_health.total_gpa_point.custom_range.data}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.today}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.yesterday}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.week}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.month}</td>
                <td>{this.state.summary.overall_health.total_gpa_point.year}</td>
            </tr>
            <tr>
                <td >Overall Health GPA</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.custom_range.from_dt} to
                 {this.state.summary.overall_health.overall_health_gpa.custom_range.to_dt} value
                 {this.state.summary.overall_health.overall_health_gpa.custom_range.data}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.today}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.yesterday}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.week}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.month}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa.year}</td>
            </tr>
            <tr>
                <td >Rank against other users</td>
                 <td>{this.state.summary.overall_health.rank.custom_range.from_dt} to
                 {this.state.summary.overall_health.rank.custom_range.to_dt} value
                 {this.state.summary.overall_health.rank.custom_range.data}</td>
                <td>{this.state.summary.overall_health.rank.today}</td>
                <td>{this.state.summary.overall_health.rank.yesterday}</td>
                <td>{this.state.summary.overall_health.rank.week}</td>
                <td>{this.state.summary.overall_health.rank.month}</td>
                <td>{this.state.summary.overall_health.rank.year}</td>
            </tr>
             <tr>
                <td>Overall Health GPA Grade</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.custom_range.from_dt} to
                 {this.state.summary.overall_health.overall_health_gpa_grade.custom_range.to_dt} value
                 {this.state.summary.overall_health.overall_health_gpa_grade.custom_range.data}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.today}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.yesterday}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.week}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.month}</td>
                <td>{this.state.summary.overall_health.overall_health_gpa_grade.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered ">
         <thead>
           
                <tr>
                <th>Movement Consistency</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
           
        </thead>
        <tbody>
            <tr>
                <td>Movement Consistency Score</td>
                <td>{this.state.summary.mc.movement_consistency_score.custom_range.from_dt} to
                 {this.state.summary.mc.movement_consistency_score.custom_range.to_dt} value
                 {this.state.summary.mc.movement_consistency_score.custom_range.data}</td>
                <td>{this.state.summary.mc.movement_consistency_score.today}</td>
                <td>{this.state.summary.mc.movement_consistency_score.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_score.week}</td>
                <td>{this.state.summary.mc.movement_consistency_score.month}</td>
                <td>{this.state.summary.mc.movement_consistency_score .year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td>{this.state.summary.mc.rank.custom_range.from_dt} to
                 {this.state.summary.mc.rank.custom_range.to_dt} value
                 {this.state.summary.mc.rank.custom_range.data}</td>
                <td>{this.state.summary.mc.rank.today}</td>
                <td>{this.state.summary.mc.rank.yesterday}</td>
                <td>{this.state.summary.mc.rank.week}</td>
                <td>{this.state.summary.mc.rank.month}</td>
                <td>{this.state.summary.mc.rank .year}</td>
            </tr>
            <tr>
                <td>Movement Consistency Grade</td>
                <td>{this.state.summary.mc.movement_consistency_grade.custom_range.from_dt} to
                 {this.state.summary.mc.movement_consistency_grade.custom_range.to_dt} value
                 {this.state.summary.mc.movement_consistency_grade.custom_range.data}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.today}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.week}</td>
                <td>{this.state.summary.mc.movement_consistency_grade.month}</td>
                <td>{this.state.summary.mc.movement_consistency_grade .year}</td>
            </tr>
            <tr>
                <td>Movement Consistency GPA</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.custom_range.from_dt} to
                 {this.state.summary.mc.movement_consistency_gpa.custom_range.to_dt} value
                 {this.state.summary.mc.movement_consistency_gpa.custom_range.data}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.today}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.yesterday}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.week}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa.month}</td>
                <td>{this.state.summary.mc.movement_consistency_gpa .year}</td>
            </tr>
        </tbody>
    </table>
</div>		
</div>

</div>

<div className="row padding">
			<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Non Exercise Steps</th>    
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Non Exercise Steps</td>
               <td>{this.state.summary.non_exercise.non_exercise_steps.custom_range.from_dt} to
                 {this.state.summary.non_exercise.non_exercise_steps.custom_range.to_dt} value
                 {this.state.summary.non_exercise.non_exercise_steps.custom_range.data}</td>
                <td>{this.state.summary.non_exercise.non_exercise_steps.today}</td>
                <td>{this.state.summary.non_exercise.non_exercise_steps.yesterday}</td>
                <td>{this.state.summary.non_exercise.non_exercise_steps.week}</td>
                <td>{this.state.summary.non_exercise.non_exercise_steps.month}</td>
                <td>{this.state.summary.non_exercise.non_exercise_steps.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td>{this.state.summary.non_exercise.rank.custom_range.from_dt} to
                 {this.state.summary.non_exercise.rank.custom_range.to_dt} value
                 {this.state.summary.non_exercise.rank.custom_range.data}</td>
                <td>{this.state.summary.non_exercise.rank.today}</td>
                <td>{this.state.summary.non_exercise.rank.yesterday}</td>
                <td>{this.state.summary.non_exercise.rank.week}</td>
                <td>{this.state.summary.non_exercise.rank.month}</td>
                <td>{this.state.summary.non_exercise.rank.year}</td>
            </tr>
            <tr>
                <td>Movement-Non Exercise Steps Grade</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range.from_dt} to
                 {this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range.to_dt} value
                 {this.state.summary.non_exercise.movement_non_exercise_step_grade.custom_range.data}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.today}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.yesterday}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.week}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.month}</td>
                <td>{this.state.summary.non_exercise.movement_non_exercise_step_grade.year}</td>
            </tr>
            <tr>
                <td>Non Exercise Steps GPA</td>
               <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range.from_dt} to
                 {this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range.to_dt} value
                 {this.state.summary.non_exercise.non_exericse_steps_gpa.custom_range.data}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.today}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.yesterday}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.week}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.month}</td>
                <td>{this.state.summary.non_exercise.non_exericse_steps_gpa.year}</td>
            </tr>
             <tr>
                <td>Total Steps</td>
                <td>{this.state.summary.non_exercise.total_steps.custom_range.from_dt} to
                 {this.state.summary.non_exercise.total_steps.custom_range.to_dt} value
                 {this.state.summary.non_exercise.total_steps.custom_range.data}</td>
                <td>{this.state.summary.non_exercise.total_steps.today}</td>
                <td>{this.state.summary.non_exercise.total_steps.yesterday}</td>
                <td>{this.state.summary.non_exercise.total_steps.week}</td>
                <td>{this.state.summary.non_exercise.total_steps.month}</td>
                <td>{this.state.summary.non_exercise.total_steps.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Nutrition</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>% of Unprocessed Food Consumed</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.from_dt} to
                 {this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.to_dt} value
                 {this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.custom_range.data}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_volume_of_food.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               <td>{this.state.summary.nutrition.rank.custom_range.from_dt} to
                 {this.state.summary.nutrition.rank.custom_range.to_dt} value
                 {this.state.summary.nutrition.rank.custom_range.data}</td>
                <td>{this.state.summary.nutrition.rank.today}</td>
                <td>{this.state.summary.nutrition.rank.yesterday}</td>
                <td>{this.state.summary.nutrition.rank.week}</td>
                <td>{this.state.summary.nutrition.rank.month}</td>
                <td>{this.state.summary.nutrition.rank.year}</td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed Grade</td>
               <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.from_dt} to
                 {this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.to_dt} value
                 {this.state.summary.nutrition.prcnt_unprocessed_food_grade.custom_range.data}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_grade.year}</td>
            </tr>
            <tr>
                <td>% Non Processed Food Consumed GPA</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.from_dt} to
                 {this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.to_dt} value
                 {this.state.summary.nutrition.prcnt_unprocessed_food_gpa.custom_range.data}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.today}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.yesterday}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.week}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.month}</td>
                <td>{this.state.summary.nutrition.prcnt_unprocessed_food_gpa.year}</td>
            </tr>
        </tbody>
    </table>
</div>



</div>

</div>

<div className="row padding">
			<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Alcohol</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Average Drinks Per Week (7 Days)</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.custom_range.from_dt} to
                 {this.state.summary.alcohol.avg_drink_per_week.custom_range.to_dt} value
                 {this.state.summary.alcohol.avg_drink_per_week.custom_range.data}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.today}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.yesterday}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.week}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.month}</td>
                <td>{this.state.summary.alcohol.avg_drink_per_week.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td>{this.state.summary.alcohol.rank.custom_range.from_dt} to
                 {this.state.summary.alcohol.rank.custom_range.to_dt} value
                 {this.state.summary.alcohol.rank.custom_range.data}</td>
                <td>{this.state.summary.alcohol.rank.today}</td>
                <td>{this.state.summary.alcohol.rank.yesterday}</td>
                <td>{this.state.summary.alcohol.rank.week}</td>
                <td>{this.state.summary.alcohol.rank.month}</td>
                <td>{this.state.summary.alcohol.rank.year}</td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week Grade</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.from_dt} to
                 {this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.to_dt} value
                 {this.state.summary.alcohol.alcoholic_drinks_per_week_grade.custom_range.data}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.today}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.yesterday}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.week}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.month}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_grade.year}</td>
            </tr>
            <tr>
                <td>Alcoholic drinks per week GPA</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.from_dt} to
                 {this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.to_dt} value
                 {this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.custom_range.data}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.today}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.yesterday}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.week}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.month}</td>
                <td>{this.state.summary.alcohol.alcoholic_drinks_per_week_gpa.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
<div className="table-responsive"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Other Stats</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>HRR (time to 99)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
               <td>HRR (heart beats lowered in 1st minute)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>HRR (higest heart rate in 1st minute)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>HRR (lowest heart rate point)</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</div>

</div>
<div className="row padding">
			<div className="col-md-6">
			<div className="table-responsive tablecenter"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Stats</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Workout Duration (hours:minutes)</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.custom_range.from_dt} to
                 {this.state.summary.exercise.workout_duration_hours_min.custom_range.to_dt} value
                 {this.state.summary.exercise.workout_duration_hours_min.custom_range.data}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.today}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.yesterday}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.week}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.month}</td>
                <td>{this.state.summary.exercise.workout_duration_hours_min.year}</td>
            </tr>
            <tr>
               <td>Workout Duration Grade </td>
                <td>{this.state.summary.exercise.workout_duration_grade.custom_range.from_dt} to
                 {this.state.summary.exercise.workout_duration_grade.custom_range.to_dt} value
                 {this.state.summary.exercise.workout_duration_grade.custom_range.data}</td>
                <td>{this.state.summary.exercise.workout_duration_grade.today}</td>
                <td>{this.state.summary.exercise.workout_duration_grade.yesterday}</td>
                <td>{this.state.summary.exercise.workout_duration_grade.week}</td>
                <td>{this.state.summary.exercise.workout_duration_grade.month}</td>
                <td>{this.state.summary.exercise.workout_duration_grade.year}</td>
            </tr>
            <tr>
                <td>Rank against other users</td>
                <td>{this.state.summary.exercise.rank.custom_range.from_dt} to
                 {this.state.summary.exercise.rank.custom_range.to_dt} value
                 {this.state.summary.exercise.rank.custom_range.data}</td>
                <td>{this.state.summary.exercise.rank.today}</td>
                <td>{this.state.summary.exercise.rank.yesterday}</td>
                <td>{this.state.summary.exercise.rank.week}</td>
                <td>{this.state.summary.exercise.rank.month}</td>
                <td>{this.state.summary.exercise.rank.year}</td>
            </tr>
            <tr>
            	<td>Workout Effort Level</td>
                <td>{this.state.summary.exercise.workout_effort_level.custom_range.from_dt} to
                 {this.state.summary.exercise.workout_effort_level.custom_range.to_dt} value
                 {this.state.summary.exercise.workout_effort_level.custom_range.data}</td>
                <td>{this.state.summary.exercise.workout_effort_level.today}</td>
                <td>{this.state.summary.exercise.workout_effort_level.yesterday}</td>
                <td>{this.state.summary.exercise.workout_effort_level.week}</td>
                <td>{this.state.summary.exercise.workout_effort_level.month}</td>
                <td>{this.state.summary.exercise.workout_effort_level.year}</td>
            </tr>
             <tr>
            	<td>Workout Effort Level Grade</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.custom_range.from_dt} to
                 {this.state.summary.exercise.workout_effort_level_grade.custom_range.to_dt} value
                 {this.state.summary.exercise.workout_effort_level_grade.custom_range.data}</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.today}</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.yesterday}</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.week}</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.month}</td>
                <td>{this.state.summary.exercise.workout_effort_level_grade.year}</td>
            </tr>

             <tr>
                <td>Average Exercise Heart Rate</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.custom_range.from_dt} to
                 {this.state.summary.exercise.avg_exercise_heart_rate.custom_range.to_dt} value
                 {this.state.summary.exercise.avg_exercise_heart_rate.custom_range.data}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.today}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.yesterday}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.week}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.month}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate.year}</td>
            </tr>
            <tr>
               <td>Average Exercise Heart Rate Grade </td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.custom_range.from_dt} to
                 {this.state.summary.exercise.avg_exercise_heart_rate_grade.custom_range.to_dt} value
                 {this.state.summary.exercise.avg_exercise_heart_rate_grade.custom_range.data}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.today}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.yesterday}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.week}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.month}</td>
                <td>{this.state.summary.exercise.avg_exercise_heart_rate_grade.year}</td>
            </tr>
            <tr>
                <td>Overall Workout Grade</td>
                <td>{this.state.summary.exercise.overall_workout_grade.custom_range.from_dt} to
                 {this.state.summary.exercise.overall_workout_grade.custom_range.to_dt} value
                 {this.state.summary.exercise.overall_workout_grade.custom_range.data}</td>
                <td>{this.state.summary.exercise.overall_workout_grade.today}</td>
                <td>{this.state.summary.exercise.overall_workout_grade.yesterday}</td>
                <td>{this.state.summary.exercise.overall_workout_grade.week}</td>
                <td>{this.state.summary.exercise.overall_workout_grade.month}</td>
                <td>{this.state.summary.exercise.overall_workout_grade.year}</td>
            </tr>
            <tr>
            	<td>Overall Exercise GPA</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.custom_range.from_dt} to
                 {this.state.summary.exercise.overall_exercise_gpa.custom_range.to_dt} value
                 {this.state.summary.exercise.overall_exercise_gpa.custom_range.data}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.today}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.yesterday}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.week}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.month}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa.year}</td>
            </tr>
             <tr>
            	<td>Overall Exercise GPA Rank</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.custom_range.from_dt} to
                 {this.state.summary.exercise.overall_exercise_gpa_rank.custom_range.to_dt} value
                 {this.state.summary.exercise.overall_exercise_gpa_rank.custom_range.data}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.today}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.yesterday}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.week}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.month}</td>
                <td>{this.state.summary.exercise.overall_exercise_gpa_rank.year}</td>
            </tr>
        </tbody>
    </table>
</div>
</div>

<div className="col-md-6">
	<div className="table-responsive tablecenter"> 
    <table className="table table-bordered">
        <thead>
            <tr>
                
                <th>Exercise Consistency</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Avg # of Days Exercised/Week</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range.from_dt} to
                 {this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range.to_dt} value
                 {this.state.summary.ec.avg_no_of_days_exercises_per_week.custom_range.data}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.today}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.yesterday}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.week}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.month}</td>
                <td>{this.state.summary.ec.avg_no_of_days_exercises_per_week.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
                <td>{this.state.summary.ec.rank.custom_range.from_dt} to
                 {this.state.summary.ec.rank.custom_range.to_dt} value
                 {this.state.summary.ec.rank.custom_range.data}</td>
                <td>{this.state.summary.ec.rank.today}</td>
                <td>{this.state.summary.ec.rank.yesterday}</td>
                <td>{this.state.summary.ec.rank.week}</td>
                <td>{this.state.summary.ec.rank.month}</td>
                <td>{this.state.summary.ec.rank.year}</td>
            </tr>
            <tr>
                <td>Exercise Consistency Grade</td>
               <td>{this.state.summary.ec.exercise_consistency_grade.custom_range.from_dt} to
                 {this.state.summary.ec.exercise_consistency_grade.custom_range.to_dt} value
                 {this.state.summary.ec.exercise_consistency_grade.custom_range.data}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.today}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.yesterday}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.week}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.month}</td>
                <td>{this.state.summary.ec.exercise_consistency_grade.year}</td>
            </tr>
            <tr>
                <td>Exercise Consistency GPA</td>
               <td>{this.state.summary.ec.exercise_consistency_gpa.custom_range.from_dt} to
                 {this.state.summary.ec.exercise_consistency_gpa.custom_range.to_dt} value
                 {this.state.summary.ec.exercise_consistency_gpa.custom_range.data}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.today}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.yesterday}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.week}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa.month}</td>
                <td>{this.state.summary.ec.exercise_consistency_gpa .year}</td>
            </tr>
        </tbody>
    </table>
</div>		
<div className="padding">
   <div className="table-responsive"> 
    <table className="table table-bordered">
         <thead>
             
                <tr>
                <th>Sleep Per Night(excluding awake time)</th>
                <th>Custom Date Range</th>
                <th>Today</th>
                <th>Yesterday</th>
                <th>Avg Last 7 Days</th>
                <th>Avg Last 30 Days</th>
                <th>Avg Year to Date</th>
            </tr>
            
        </thead>
        <tbody>
            <tr>
                <td>Total Sleep in hours:minutes</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.custom_range.from_dt} to
                 {this.state.summary.sleep.total_sleep_in_hours_min.custom_range.to_dt} value
                 {this.state.summary.sleep.total_sleep_in_hours_min.custom_range.data}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.today}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.yesterday}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.week}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.month}</td>
                <td>{this.state.summary.sleep.total_sleep_in_hours_min.year}</td>
            </tr>
            <tr>
               <td>Rank against other users</td>
               <td>{this.state.summary.sleep.rank.custom_range.from_dt} to
                 {this.state.summary.sleep.rank.custom_range.to_dt} value
                 {this.state.summary.sleep.rank.custom_range.data}</td>
                <td>{this.state.summary.sleep.rank.today}</td>
                <td>{this.state.summary.sleep.rank.yesterday}</td>
                <td>{this.state.summary.sleep.rank.week}</td>
                <td>{this.state.summary.sleep.rank.month}</td>
                <td>{this.state.summary.sleep.rank.year}</td>
            </tr>
            <tr>
                <td>Average Sleep Grage</td>
               <td>{this.state.summary.sleep.average_sleep_grade.custom_range.from_dt} to
                 {this.state.summary.sleep.average_sleep_grade.custom_range.to_dt} value
                 {this.state.summary.sleep.average_sleep_grade.custom_range.data}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.today}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.yesterday}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.week}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.month}</td>
                <td>{this.state.summary.sleep.average_sleep_grade.year}</td>
            </tr>
            <tr>
                <td>Overall Sleep GPA</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.custom_range.from_dt} to
                 {this.state.summary.sleep.overall_sleep_gpa.custom_range.to_dt} value
                 {this.state.summary.sleep.overall_sleep_gpa.custom_range.data}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.today}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.yesterday}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.week}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.month}</td>
                <td>{this.state.summary.sleep.overall_sleep_gpa.year}</td>
            </tr>
        </tbody>
    </table>
</div>
         
</div>
</div>


</div>
</div>

</div>		
			
			)
	}
}

function mapStateToProps(state){
  return {
    errorMessage: state.garmin_auth.error,
    message : state.garmin_auth.message
  };
}
export default connect(mapStateToProps,{getGarminToken,logoutUser})(withRouter(DashboardSummary));
Navbar.propTypes={
    fixed: PropTypes.string,
    color: PropTypes.string,
}