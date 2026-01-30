# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["src/TaskList.API/TaskList.API.csproj", "TaskList.API/"]
COPY ["src/TaskList.Application/TaskList.Application.csproj", "TaskList.Application/"]
COPY ["src/TaskList.Core/TaskList.Core.csproj", "TaskList.Core/"]
COPY ["src/TaskList.Infrastructure/TaskList.Infrastructure.csproj", "TaskList.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "TaskList.API/TaskList.API.csproj"

# Copy everything else
COPY src/ .

# Build
WORKDIR "/src/TaskList.API"
RUN dotnet build "TaskList.API.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "TaskList.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "TaskList.API.dll"]
