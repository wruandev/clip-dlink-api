# Clip Dlink API

An API written in Express JS to provide data for [Clip Dlink Web App](https://github.com/wruandev/clip-dlink).

## Requirements

- Node JS version 18 or above
- MySQL version 8 or above (tested)

## Usage

To run the API run this command :

```cmd
npm start
```

## MySQL Database Schema

This API need a database with these following tables:

### Table > users

| Column Name | Type         |
| ----------- | ------------ |
| user_id     | char(36)     |
| username    | varchar(30)  |
| password    | varchar(255) |
| name        | varchar(255) |
| created_at  | timestamp    |
| updated_at  | timestamp    |

### Table > shortlinks

| Column Name  | Type        |
| ------------ | ----------- |
| shortlink_id | char(36)    |
| user_id      | char(36)    |
| full_url     | text        |
| slug         | varchar(24) |
| visited      | int         |
| created_at   | timestamp   |
| updated_at   | timestamp   |

## License

MIT
