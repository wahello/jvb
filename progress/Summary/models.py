from django.db import models
from datetime import date,timedelta
import statistics
# Create your models here.
class Summary_Desktop(models.Model):
    Non_Exercise_Steps = models.IntegerField()
    Non_Exercise_Steps_Grade = models.CharField(max_length=1)
    Movement_When_Not_Sleeping = models.IntegerField(help_text=('Number of Hours per day Moved less than 300 steps an hour'))
    Standing_Work_Station = models.IntegerField(help_text=('Number of Daysyou stood for 3 hours or more yesterday when you worked(on work days)'))
    Movment_Consistency_Grade = models.CharField(max_length=1,help_text=('Number of Hours per day Moved less than 300 steps an hour'))
    Total_Sleep_In_Hours = models.IntegerField()
    Sleep_Aids_To_Aid_Sleep = models.IntegerField(help_text=('Number of time you took any prescription or non prescription sleep aids to aid aleep excluding melatonin'))
    Overall_Sleep_Grade = models.CharField(max_length=1)
    Bedtime = models.IntegerField()
    Awake_From_Sleep = models.IntegerField()
    Resting_Heart_Rate = models.IntegerField(help_text=('Sleeping'))
    Excersice_Consistency =models.IntegerField(help_text=('Days Worked Out'))
    Average_days_Per_Week_Exercised_Over_Period = models.IntegerField()
    Excersice_Consistency_Grade = models.CharField(max_length=1)
    Overall_Exercise_Score = models.IntegerField()
    Overall_Exercise_Grade = models.CharField(max_length=1)
    Workout_Duration = models.IntegerField()
    Workout_Duration_Grade = models.CharField(max_length=1)
    Workout_Effort_Level = models.IntegerField()
    Workout_Effort_Level_Grade = models.CharField(max_length=1)
    Average_Exercise_Heartrate = models.IntegerField()
    Average_Exercise_Heartrate_Grade = models.CharField(max_length=1)
    Non_Processed_Food_Consumed = models.IntegerField(help_text=('percentage'))
    Non_Processed_Food_Consumed_Grade = models.CharField(max_length=1,help_text=('percentage'))
    Average_Drinks_Per_Day = models.IntegerField(help_text=('Alcohol'))
    Average_Drinks_Per_Week = models.IntegerField(help_text = ('Alcohol'))
    Average_Drinks_Grade =  models.CharField(max_length=1,help_text=('Based on weekly consumption of Alcohol'))

    def score_week(self,date,timedelta):
            start_date = datetime.date.today()
            end_date = start_date-timedelta(6)
            if(Non_Exercise_Steps):
                items = [Non_Exercise_Steps.start_date(),Non_Exercise_Steps.datetime.start_date-timedelta(1),Non_Exercise_Steps.start_date-timedelta(2),Non_Exercise_Steps.start_date-timedelta(3),Non_Exercise_Steps.start_date-timedelta(4),Non_Exercise_Steps.start_date-timedelta(5),Non_Exercise_Steps.start_date-timedelta(6)]
                average = sum(Non_Exercise_Steps.start_date(),Non_Exercise_Steps.end_date())/7
                median = statistics.median(items)
                best = max(Non_Exercise_Steps.date.start_date(),Non_Exercise_Steps.end_date())
                worst = min(Non_Exercise_Steps.date.start_date(),Non_Exercise_Steps.end_date())
            elif(Movement_When_Not_Sleeping):
                items = [Movement_When_Not_Sleeping.start_date(),Movement_When_Not_Sleeping.start_date-timedelta(1),
                        Movement_When_Not_Sleeping.start_date-timedelta(2),
                        Movement_When_Not_Sleeping.start_date-timedelta(3),
                        Movement_When_Not_Sleeping.start_date-timedelta(4),
                        Movement_When_Not_Sleeping.start_date-timedelta(5),
                        Movement_When_Not_Sleeping.start_date-timedelta(6),]

                average = sum(Movement_When_Not_Sleeping.start_date(),Movement_When_Not_Sleeping.end_date())/7
                median = statistics.median(items)
                best = max(Movement_When_Not_Sleeping.start_date(),Movement_When_Not_Sleeping.end_date())
                worst = min(Movement_When_Not_Sleeping.start_date(),Movement_When_Not_Sleeping.end_date())
            elif(Standing_Work_Station):
                items = [Standing_Work_Station.start_date(),Standing_Work_Station.start_date-timedelta(1),
                        Standing_Work_Station.start_date-timedelta(2),
                        Standing_Work_Station.start_date-timedelta(3),
                        Standing_Work_Station.start_date-timedelta(4),
                        Standing_Work_Station.start_date-timedelta(5),
                        Standing_Work_Station.start_date-timedelta(6),
                        ]
                average = sum(Standing_Work_Station.start_date(),Standing_Work_Station.end_date())/7
                median = statistics.median(items)
                best = max(Standing_Work_Station.start_date(),Standing_Work_Station.end_date())
                worst = min(Standing_Work_Station.start_date(),Standing_Work_Station.end_date())
            elif(Total_Sleep_In_Hours):
                items = [Total_Sleep_In_Hours.start_date(),Total_Sleep_In_Hours.start_date-timedelta(1),
                        Total_Sleep_In_Hours.start_date-timedelta(2),
                        Total_Sleep_In_Hours.start_date-timedelta(3),
                        Total_Sleep_In_Hours.start_date-timedelta(4),
                        Total_Sleep_In_Hours.start_date-timedelta(5),
                        Total_Sleep_In_Hours.start_date-timedelta(6),
                        ]
                average = sum(Total_Sleep_In_Hours.start_date(),Total_Sleep_In_Hours.end_date())/7
                median = statistics.median(items)
                best = max(Total_Sleep_In_Hours.start_date(),Total_Sleep_In_Hours.end_date())
                worst = min(Total_Sleep_In_Hours.start_date(),Total_Sleep_In_Hours.end_date())
            elif(Overall_Exercise_Score):
                items = [Overall_Exercise.start_date(),Overall_Exercise.start_date-timedelta(1),
                        Overall_Exercise.start_date-timedelta(2),
                        Overall_Exercise.start_date-timedelta(3),
                        Overall_Exercise.start_date-timedelta(4),
                        Overall_Exercise.start_date-timedelta(5),
                        Overall_Exercise.start_date-timedelta(6),
                        ]
                average = sum(Overall_Exercise.start_date(),Overall_Exercise.end_date())/7
                median = statistics.median(items)
                best = max(Overall_Exercise.start_date(),Overall_Exercise.end_date())
                worst = min(Overall_Exercise.start_date(),Overall_Exercise.end_date())
            elif(Workout_Duration):
                items = [Workout_Duration.start_date(),Workout_Duration.start_date-timedelta(1),
                        Workout_Duration.start_date-timedelta(2),
                        Workout_Duration.start_date-timedelta(3),
                        Workout_Duration.start_date-timedelta(4),
                        Workout_Duration.start_date-timedelta(5),
                        Workout_Duration.start_date-timedelta(6),
                        ]
                average = sum(Workout_Duration.start_date(),Workout_Duration.end_date())/7
                median = statistics.median(items)
                best = max(Workout_Duration.start_date(),Workout_Duration.end_date())
                worst = min(Workout_Duration.start_date(),Workout_Duration.end_date())
            elif(Workout_Effort_Level):
                items = [Workout_Effort_Level.start_date(),Workout_Effort_Level.start_date-timedelta(1),
                        Workout_Effort_Level.start_date-timedelta(2),
                        Workout_Effort_Level.start_date-timedelta(3),
                        Workout_Effort_Level.start_date-timedelta(4),
                        Workout_Effort_Level.start_date-timedelta(5),
                        Workout_Effort_Level.start_date-timedelta(6),
                        ]
                average = sum(Workout_Effort_Level.start_date(),Workout_Effort_Level.end_date())/7
                median = statistics.median(items)
                best = max(Workout_Effort_Level.start_date(),Workout_Effort_Level.end_date())
                worst = min(Workout_Effort_Level.start_date(),Workout_Effort_Level.end_date())
            elif(Average_Exercise_Heartrate):
                items = [Average_Exercise_Heartrate.start_date(),Average_Exercise_Heartrate.start_date-timedelta(1),
                        Average_Exercise_Heartrate.start_date-timedelta(2),
                        Average_Exercise_Heartrate.start_date-timedelta(3),
                        Average_Exercise_Heartrate.start_date-timedelta(4),
                        Average_Exercise_Heartrate.start_date-timedelta(5),
                        Average_Exercise_Heartrate.start_date-timedelta(6),
                        ]
                average = sum(Average_Exercise_Heartrate.start_date(),Average_Exercise_Heartrate.end_date())/7
                median = statistics.median(items)
                best = max(Average_Exercise_Heartrate.start_date(),Average_Exercise_Heartrate.end_date())
                worst = min(Average_Exercise_Heartrate.start_date(),Average_Exercise_Heartrate.end_date())
            elif(Non_Processed_Food_Consumed):
                items = [Non_Processed_Food_Consumed.start_date(),Non_Processed_Food_Consumed.start_date-timedelta(1),
                        Non_Processed_Food_Consumed.start_date-timedelta(2),
                        Non_Processed_Food_Consumed.start_date-timedelta(3),
                        Non_Processed_Food_Consumed.start_date-timedelta(4),
                        Non_Processed_Food_Consumed.start_date-timedelta(5),
                        Non_Processed_Food_Consumed.start_date-timedelta(6),
                        ]
                average = sum(Non_Processed_Food_Consumed.start_date(),Non_Processed_Food_Consumed.end_date())/7
                median = statistics.median(items)
                best = max(Non_Processed_Food_Consumed.start_date(),Non_Processed_Food_Consumed.end_date())
                worst = min(Non_Processed_Food_Consumed.start_date(),Non_Processed_Food_Consumed.end_date())
