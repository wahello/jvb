from rest_framework import serializers

from Summary.models import Summary_Desktop
class SummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary_Desktop
        fields = ('Non_Exercise_Steps', 'Non_Exercise_Steps_Grade', 'Movement_When_Not_Sleeping', 'Standing_Work_Station',
        'Movment_Consistency_Grade', 'Total_Sleep_In_Hours','Sleep_Aids_To_Aid_Sleep','Overall_Sleep_Grade','Bedtime','Awake_From_Sleep','Resting_Heart_Rate',
        'Excersice_Consistency','Average_days_Per_Week_Exercised_Over_Period','Excersice_Consistency_Grade','Overall_Exercise_Score','Overall_Exercise_Grade',
        'Workout_Duration','Workout_Duration_Grade','Workout_Effort_Level','Workout_Effort_Level_Grade','Average_Exercise_Heartrate','Average_Exercise_Heartrate_Grade',
        'Non_Processed_Food_Consumed','Non_Processed_Food_Consumed_Grade','Average_Drinks_Per_Day','Average_Drinks_Per_Week','Average_Drinks_Grade')

    def create(self, validated_data):
        return Summary_Desktop.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.Non_Exercise_Steps = validated_data.get('Non_Exercise_Steps',instance.Non_Exercise_Steps)
        instance.Non_Exercise_Steps_Grade = validated_data.get('Non_Exercise_Steps_Grade',instance.Non_Exercise_Steps_Grade)
        instance.Movement_When_Not_Sleeping = validated_data.get('Movement_When_Not_Sleeping',instance.Movement_When_Not_Sleeping)
        instance.Standing_Work_Station = validated_data.get('Standing_Work_Station',instance.Standing_Work_Station)
        instance.Movment_Consistency_Grade = validated_data.get('Movment_Consistency_Grade',instance.Movment_Consistency_Grade)
        instance.Total_Sleep_In_Hours = validated_data.get('Total_Sleep_In_Hours',instance.Total_Sleep_In_Hours)
        instance.Sleep_Aids_To_Aid_Sleep = validated_data.get('Sleep_Aids_To_Aid_Sleep',instance.Sleep_Aids_To_Aid_Sleep)
        instance.Overall_Sleep_Grade = validated_data.get('Overall_Sleep_Grade',instance.Overall_Sleep_Grade)
        instance.Bedtime = validated_data.get('Bedtime',instance.Bedtime)
        instance.Awake_From_Sleep = validated_data.get('Awake_From_Sleep',instance.Awake_From_Sleep )
        instance.Resting_Heart_Rate = validated_data.get('Resting_Heart_Rate',instance.Resting_Heart_Rate)
        instance.Excersice_Consistency =validated_data.get('Excersice_Consistency',instance.Excersice_Consistency)
        instance.Average_days_Per_Week_Exercised_Over_Period = validated_data.get('Average_days_Per_Week_Exercised_Over_Period',instance.Average_days_Per_Week_Exercised_Over_Period)
        instance.Excersice_Consistency_Grade = validated_data.get('Excersice_Consistency_Grade',instance.Excersice_Consistency_Grade)
        instance.Overall_Exercise_Score = validated_data.get('Overall_Exercise_Score',instance.Overall_Exercise_Score)
        instance.Overall_Exercise_Grade = validated_data.get('Overall_Exercise_Grade',instance.Overall_Exercise_Grade)
        instance.Workout_Duration = validated_data.get('Workout_Duration',instance.Workout_Duration)
        instance.Workout_Duration_Grade = validated_data.get('Workout_Duration_Grade',instance.Workout_Duration_Grade)
        instance.Workout_Effort_Level = validated_data.get('Workout_Effort_Level',instance.Workout_Effort_Level)
        instance.Workout_Effort_Level_Grade = validated_data.get('Workout_Effort_Level_Grade ',instance.Workout_Effort_Level_Grade )
        instance.Average_Exercise_Heartrate = validated_data.get('Average_Exercise_Heartrate',instance.Average_Exercise_Heartrate)
        instance.Average_Exercise_Heartrate_Grade = validated_data.get('Average_Exercise_Heartrate_Grade',instance.Average_Exercise_Heartrate_Grade)
        instance.Non_Processed_Food_Consumed = validated_data.get('Non_Processed_Food_Consumed',instance.Non_Processed_Food_Consumed)
        instance.Non_Processed_Food_Consumed_Grade = validated_data.get('Non_Processed_Food_Consumed_Grade',instance.Non_Processed_Food_Consumed_Grade)
        instance.Average_Drinks_Per_Day = validated_data.get('Average_Drinks_Per_Day',instance.Average_Drinks_Per_Day)
        instance.Average_Drinks_Per_Week = validated_data.get('Average_Drinks_Per_Week',instance.Average_Drinks_Per_Week)
        instance.Average_Drinks_Grade =  validated_data.get('Average_Drinks_Grade',instance.Average_Drinks_Grade)
        instance.save()
        return instance
